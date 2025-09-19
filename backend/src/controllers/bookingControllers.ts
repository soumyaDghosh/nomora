import { Request, Response } from "express";
import { DatabaseError } from "pg";
import axios from "axios";
import crypto from "crypto";
import { pool } from "../config/db";
import { getPaymentOrder, getPaymentStatus } from "../services/payment";

const ALLOWED_PRODUCT_TYPES = [
    "sameday",
    "city_sightseeing",
    "airport_transfer",
    "overnight",
    "experiences",
] as const;

const validateDate = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);
const validateTime = (time: string) => /^(0?[1-9]|1[0-2])(:[0-5][0-9])? (AM|PM)$/.test(time);

function validateTripWindow(date: string, time: string): string | null {
    try {
        const bookingDateTime = parseDateTime(date, time);
        const now = new Date();

        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const bookingStart = new Date(bookingDateTime.getFullYear(), bookingDateTime.getMonth(), bookingDateTime.getDate());

        const daysDiff = Math.floor((bookingStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff < 0 || daysDiff > 7) {
            return "Trip can only be booked within 7 days from today";
        }

        const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        if (hoursDiff < 8) {
            return "Trip must be booked at least 8 hours in advance";
        }

        return null;
    }
    catch (err) {
        return "Invalid trip date/time";
    }
}

function parseDateTime(date: string, time: string): Date {
    let normalized = time.trim().toUpperCase();
    if (!normalized.includes(":")) {
        normalized = normalized.replace(/ (AM|PM)$/, ":00 $1");
    }

    const [year, month, day] = date.split("-").map(Number);

    const match = normalized.match(/^(\d{1,2})(?::(\d{2}))? (AM|PM)$/);
    if (!match) {
        throw new Error(`Invalid time format after normalization: ${normalized}`);
    }

    let hour = Number(match[1]);
    const minute = match[2] ? Number(match[2]) : 0;
    const meridiem = match[3];

    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, minute, 0, 0);
}

export const createBooking = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const user_id = req.user?.id;
        const hotel_id = req.cookies?.hotel_id;
        const hotel_name = req.cookies?.hotel_name;
        const {
            product_type,
            ac_type,
            car_type,
            transfer_type,
            terminal,
            guest_count,
            date,
            time,
            price,
            listing_id
        } = req.body ?? {};

        if (!user_id) return res.status(401).json({ message: "Unauthorized: user_id missing" });
        if (!hotel_id) return res.status(400).json({ message: "hotel_id is required" });
        if (!hotel_name) return res.status(400).json({ message: "hotel_name is required" });
        if (!product_type) return res.status(400).json({ message: "product_type is required" });
        if (!ALLOWED_PRODUCT_TYPES.includes(product_type)) {
            return res.status(400).json({ message: `product_type must be one of: ${ALLOWED_PRODUCT_TYPES.join(", ")}` });
        }
        if (price === undefined) return res.status(400).json({ message: "price is required" });
        if (["sameday", "city_sightseeing"].includes(product_type)) {
            if (!listing_id) return res.status(400).json({ message: "listing_id is required" });
            if (!ac_type || !["AC", "Non-AC"].includes(ac_type))
                return res.status(400).json({ message: "ac_type must be either 'AC' or 'Non-AC'" });
            if (!car_type || !["Go", "Comfort", "Edge", "Max"].includes(car_type))
                return res.status(400).json({ message: "car_type must be one of: Go, Comfort, Edge, Max" });
            if (!validateDate(date)) return res.status(400).json({ message: "date must be in format YYYY-MM-DD" });
            if (!validateTime(time)) return res.status(400).json({ message: "time must be in format h:mm AM/PM" });

            const windowError = validateTripWindow(date, time);
            if (windowError) return res.status(400).json({ message: windowError });
        }
        else if (product_type === "airport_transfer") {
            if (!transfer_type || !["Drop to Airport", "Pickup from Airport"].includes(transfer_type))
                return res.status(400).json({ message: "transfer_type must be one of: Drop to Airport, Pickup from Airport" });
            if (!terminal?.trim()) return res.status(400).json({ message: "terminal is required" });
            if (!validateDate(date)) return res.status(400).json({ message: "date must be in format YYYY-MM-DD" });
            if (!validateTime(time)) return res.status(400).json({ message: "time must be in format h:mm AM/PM" });

            const count = Number(guest_count);
            if (!Number.isInteger(count) || count < 1 || count > 4)
                return res.status(400).json({ message: "guest_count must be an integer between 1 and 4" });

            const bookingDateTime = parseDateTime(date, time);
            const now = new Date();
            const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);
            if (bookingDateTime < fourHoursLater) {
                return res.status(400).json({ message: "Airport transfer must be booked at least 4 hours in advance" });
            }
        }

        await client.query("BEGIN");

        if (process.env.NODE_ENV === "production") {
            if (product_type === "airport_transfer") {
                const dupCheck = await client.query(
                    `
                    SELECT 1 
                    FROM bookings 
                    WHERE user_id = $1 
                    AND hotel_id = $2 
                    AND transfer_type = $3 
                    AND status = 'ongoing'
                    LIMIT 1
                    `,
                    [user_id, hotel_id, transfer_type]
                );

                if (dupCheck.rows.length > 0) {
                    await client.query("ROLLBACK");
                    return res.status(409).json({
                        message: `You already have an ongoing ${transfer_type} booking at this hotel`,
                    });
                }
            }
            else {
                const dupCheck = await client.query(
                    `
                    SELECT 1 
                    FROM bookings 
                    WHERE user_id = $1 
                    AND hotel_id = $2 
                    AND listing_id = $3 
                    AND status = 'ongoing'
                    LIMIT 1
                    `,
                    [user_id, hotel_id, listing_id]
                );

                if (dupCheck.rows.length > 0) {
                    await client.query("ROLLBACK");
                    return res.status(409).json({
                        message: `You already have an ongoing booking for this listing at this hotel`,
                    });
                }
            }
        }

        const bookingResult = await client.query(
            `
            INSERT INTO bookings (
                user_id, product_type, ac_type, car_type, transfer_type, 
                terminal, guest_count, date, time, price, hotel_id, listing_id
            )
            VALUES (
                $1, $2, $3, $4, $5, 
                $6, $7, $8, $9, $10, $11, $12
            )
            RETURNING id
            `,
            [
                user_id, product_type, ac_type ?? "AC", car_type ?? "Comfort", transfer_type ?? null,
                terminal ?? null, guest_count ?? null, date, time, price, hotel_id, listing_id ?? null
            ]
        );
        const bookingId = bookingResult.rows[0].id;

        const paymentOrder = await getPaymentOrder({
            receipt_id: crypto.randomUUID(),
            amount: Math.round(price * 0.25 * 100)
        });

        await client.query("COMMIT");

        return res.status(201).json({
            message: "Booked successfully",
            booking_id: bookingId,
            order_id: paymentOrder.id,
            order_amount: paymentOrder.amount
        });
    }
    catch (error) {
        await client.query("ROLLBACK");

        if (error instanceof DatabaseError) {
            return res.status(500).json({ message: "Database error" });
        }
        else {
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const verifyBooking = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const hotel_id = req.cookies?.hotel_id;
        const hotel_name = req.cookies?.hotel_name;
        const { booking_id, order_id, payment_id } = req.body ?? {};

        if (!booking_id) return res.status(401).json({ message: "booking_id is required" });
        if (!order_id) return res.status(400).json({ message: "order_id is required" });

        await client.query("BEGIN");

        const paymentResult = await client.query(
            `
            SELECT status 
            FROM payments 
            WHERE booking_id = $1 AND order_id = $2 AND payment_id = $3
            FOR UPDATE
            `,
            [booking_id, order_id, payment_id]
        );

        if (paymentResult.rows.length > 0) {
            await client.query("ROLLBACK");
            return res.status(400).json({
                message: `Payment already ${paymentResult.rows[0].status.toLowerCase()}`
            });
        }

        const { status, payment_method, amount } = await getPaymentStatus({ order_id, payment_id });
        const processedAmount = amount !== undefined && amount !== null ? Number(amount) / 100 : null;

        if (status === "COMPLETED") {
            await client.query(
                `
                INSERT INTO payments (booking_id, order_id, payment_id, amount, status, method)
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [booking_id, order_id, payment_id, processedAmount, status, payment_method]
            );

            const bookingResult = await client.query(
                `
                UPDATE bookings
                SET status = 'ongoing', payment_status = 'advance-paid'
                WHERE id = $1
                RETURNING id, status, product_type, listing_id, price, payment_status, ac_type, car_type, transfer_type, terminal, guest_count, date, time
                `,
                [booking_id]
            );

            if (bookingResult.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ message: "Booking not found" });
            }

            const booking = {
                ...bookingResult.rows[0],
                paid_amount: processedAmount,
            };

            if (process.env.NODE_ENV === "production") {
                axios.post(
                    "https://api.resend.com/emails",
                    {
                        from: "Acme <onboarding@resend.dev>",
                        to: ["nomoradev@gmail.com"],
                        subject: "New Booking",
                        html: `
Booking ID: ${booking_id}<br /><br />
Hotel ID: ${hotel_id}<br />
Hotel Name: ${hotel_name}<br /><br />
User ID: ${req.user?.id}<br />
User Phone: ${req.user?.phone}<br /><br />
Product Type: ${booking.product_type}<br />
${booking.product_type !== "airport_transfer" ? `Listing ID: ${booking.listing_id}<br />` : ""}
<br />
${booking.product_type === "airport_transfer" ? `Transfer Type: ${booking.transfer_type}<br />` : ""}
${booking.product_type === "airport_transfer" ? `Terminal: ${booking.terminal}<br />` : ""}
${booking.product_type === "airport_transfer" ? `Guest Count: ${booking.guest_count}<br /><br />` : ""}
Car Type: ${booking.product_type === "airport_transfer" ? 'Comfort' : booking.car_type}<br />
AC Type: ${booking.product_type === "airport_transfer" ? 'AC' : booking.ac_type}<br /><br />
Price: ₹${booking.price}<br />
Advance: ₹${booking.paid_amount}<br />
Payment Status: ${booking.payment_status}<br /><br />
Date: ${new Date(booking.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}<br />
Time: ${booking.time}
`,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
                            "Content-Type": "application/json",
                        },
                    }
                );
            }

            await client.query("COMMIT");

            return res.status(201).json({
                message: `Payment ${status}`,
                booking
            });
        }
        else {
            await client.query(
                `
                INSERT INTO payments (booking_id, order_id, payment_id, amount, status, method)
                VALUES ($1, $2, $3, $4, $5, $6)
                `,
                [booking_id, order_id, payment_id ?? null, processedAmount ?? null, status, payment_method ?? null]
            );

            if (status === "FAILED") {
                await client.query(
                    `
                    UPDATE bookings
                    SET status = 'cancelled'
                    WHERE id = $1
                    `,
                    [booking_id]
                );
            }

            await client.query("COMMIT");

            return res.status(400).json({
                message: `Payment ${status.toLowerCase()}. If money has been deducted, it will be refunded shortly. You can retry payment again with different payment method.`
            });
        }
    }
    catch (error) {
        await client.query("ROLLBACK");

        if (error instanceof DatabaseError) {
            return res.status(500).json({ message: "Database error" });
        }
        else {
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const listBookings = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const user_id = req.user?.id;
        const hotel_id = req.cookies?.hotel_id;

        if (!user_id) return res.status(401).json({ message: "Unauthorized: user_id missing" });
        if (!hotel_id) return res.status(400).json({ message: "hotel_id is required" });

        const result = await client.query(
            `
            SELECT id, status, product_type, listing_id, price, payment_status, ac_type, car_type, transfer_type, terminal, guest_count, date, time
            FROM bookings
            WHERE user_id = $1 AND hotel_id = $2
            ORDER BY created_at DESC
            `,
            [user_id, hotel_id]
        );

        return res.status(200).json({ bookings: result.rows });
    }
    catch (error) {
        if (error instanceof DatabaseError) {
            return res.status(500).json({ message: "Database error" });
        }
        else {
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};

export const bookingDetails = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const user_id = req.user?.id;
        const { booking_id } = req.query ?? {};

        if (!user_id) {
            return res.status(401).json({ message: "Unauthorized: user_id missing" });
        }
        if (!booking_id) {
            return res.status(400).json({ message: "booking_id is required" });
        }

        const result = await client.query(
            `
            SELECT id, user_id, hotel_id, status, product_type, listing_id, price, payment_status, ac_type, car_type, transfer_type, terminal, guest_count, date, time
            FROM bookings
            WHERE id = $1
            LIMIT 1
            `,
            [booking_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const row = result.rows[0];

        if (row.user_id !== user_id) {
            return res.status(401).json({ message: "Forbidden: booking does not belong to user" });
        }
        if (row.status === "processing" || row.status === "cancelled") {
            return res.status(404).json({ message: `Booking ${row.status}` });
        }

        const paymentResult = await client.query(
            `
            SELECT COALESCE(SUM(amount), 0) AS paid_amount
            FROM payments
            WHERE booking_id = $1 AND status = 'COMPLETED'
            `,
            [booking_id]
        );
        const paid_amount = paymentResult.rows[0]?.paid_amount ?? 0;

        return res.status(200).json({
            booking: {
                id: row.id,
                status: row.status,
                product_type: row.product_type,
                listing_id: row.listing_id,
                ac_type: row.ac_type,
                car_type: row.car_type,
                transfer_type: row.transfer_type,
                terminal: row.terminal,
                guest_count: row.guest_count,
                price: row.price,
                paid_amount: Number(paid_amount),
                payment_status: row.payment_status,
                date: row.date,
                time: row.time,
            },
        });
    }
    catch (error) {
        if (error instanceof DatabaseError) {
            return res.status(500).json({ message: "Database error" });
        }
        else {
            return res.status(500).json({ message: "Server error" });
        }
    }
    finally {
        client.release();
    }
};