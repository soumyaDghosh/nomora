import { Request, Response } from "express";
import { DatabaseError } from "pg";
import axios from "axios";
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
                    `SELECT 1 
                    FROM bookings 
                    WHERE user_id = $1 
                    AND hotel_id = $2 
                    AND transfer_type = $3 
                    AND status = 'ongoing'
                    LIMIT 1`,
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
                    `SELECT 1 
                    FROM bookings 
                    WHERE user_id = $1 
                    AND hotel_id = $2 
                    AND listing_id = $3 
                    AND status = 'ongoing'
                    LIMIT 1`,
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

        const paymentResult = await client.query(
            `INSERT INTO payments (booking_id, user_id) VALUES ($1, $2) RETURNING id`,
            [bookingId, user_id]
        );
        const paymentId = paymentResult.rows[0].id;

        const paymentOrder = await getPaymentOrder({
            receipt_id: paymentId,
            amount: Math.round(price * 0.25 * 100)
        });

        await client.query(
            `UPDATE payments SET order_id = $1, amount = $2 WHERE id = $3`,
            [paymentOrder.id, price * 0.25, paymentId]
        );

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
    try {
        const user_id = req.user?.id;
        const { booking_id, order_id, payment_id } = req.body ?? {};

        if (!user_id) return res.status(401).json({ message: "Unauthorized: user_id missing" });
        if (!booking_id) return res.status(401).json({ message: "booking_id is required" });
        if (!order_id) return res.status(400).json({ message: "order_id is required" });

        const paymentResult = await pool.query(
            `SELECT id, status FROM payments WHERE user_id = $1 AND booking_id = $2 AND order_id = $3`,
            [user_id, booking_id, order_id]
        );
        if (paymentResult.rows.length === 0) {
            return res.status(404).json({ message: "Payment not found" });
        }

        const { status: dbStatus } = paymentResult.rows[0];
        if (dbStatus !== "PENDING") {
            return res.status(400).json({
                message: `Payment already ${dbStatus}`
            });
        }

        const { status, payment_method, amount } = await getPaymentStatus({ order_id });
        if (status === "FAILED") {
            return res.status(400).json({
                message: `Payment ${status}`
            });
        }

        const processedAmount = amount !== undefined && amount !== null ? Number(amount) / 100 : null;
        await pool.query(
            `
            UPDATE payments 
            SET status = $1, method = $2, amount = $3, payment_id = $4
            WHERE user_id = $5 AND booking_id = $6 AND order_id = $7
            `,
            [status, payment_method ?? null, processedAmount, payment_id ?? null, user_id, booking_id, order_id]
        );

        await pool.query(
            `
            UPDATE bookings
            SET payment_status = 'advance-paid'
            WHERE id = $1 AND user_id = $2
            `,
            [booking_id, user_id]
        );

        const bookingRow = await pool.query(
            `SELECT id, status, product_type, listing_id, price, payment_status, ac_type, car_type, transfer_type, terminal, guest_count, date, time 
             FROM bookings 
             WHERE id = $1 AND user_id = $2`,
            [booking_id, user_id]
        );

        const booking = {
            ...bookingRow.rows[0],
            paid_amount: processedAmount,
        };

        return res.status(201).json({
            message: `Payment ${status}`,
            booking
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
};

//         if (process.env.NODE_ENV === "production") {
//             axios.post(
//                 "https://api.resend.com/emails",
//                 {
//                     from: "Acme <onboarding@resend.dev>",
//                     to: ["nomoradev@gmail.com"],
//                     subject: "New Booking",
//                     html: `
// Booking ID: ${booking_id}<br /><br />
// Hotel ID: ${hotel_id}<br />
// Hotel Name: ${hotel_name}<br /><br />
// User ID: ${req.user?.id}<br />
// User Phone: ${req.user?.phone}<br /><br />
// Product Type: ${product_type}<br />
// ${product_type !== "airport_transfer" ? `Listing ID: ${listing_id}<br />` : ""}
// <br />
// ${product_type === "airport_transfer" ? `Transfer Type: ${transfer_type}<br />` : ""}
// ${product_type === "airport_transfer" ? `Terminal: ${terminal}<br />` : ""}
// ${product_type === "airport_transfer" ? `Guest Count: ${guest_count}<br /><br />` : ""}
// Car Type: ${product_type === "airport_transfer" ? 'Comfort' : car_type}<br />
// AC Type: ${product_type === "airport_transfer" ? 'AC' : ac_type}<br /><br />
// Price: ₹${price}<br /><br />
// Date: ${new Date(date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}<br />
// Time: ${time}
// `,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );
//         }

export const listBookings = async (req: Request, res: Response) => {
    const client = await pool.connect();

    try {
        const user_id = req.user?.id;
        const hotel_id = req.cookies?.hotel_id;

        if (!user_id) return res.status(401).json({ message: "Unauthorized: user_id missing" });
        if (!hotel_id) return res.status(400).json({ message: "hotel_id is required" });

        const result = await client.query(
            `SELECT id, status, product_type, listing_id, price, payment_status, ac_type, car_type, 
                    transfer_type, terminal, guest_count, date, time, created_at
             FROM bookings
             WHERE user_id = $1 AND hotel_id = $2
             ORDER BY created_at DESC`,
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
            `SELECT id, user_id, hotel_id, status, product_type, listing_id, price, payment_status,
                    ac_type, car_type, transfer_type, terminal, guest_count,
                    date, time, created_at
             FROM bookings
             WHERE id = $1
             LIMIT 1`,
            [booking_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const row = result.rows[0];

        if (row.user_id !== user_id) {
            return res.status(403).json({ message: "Forbidden: booking does not belong to user" });
        }

        if (row.status === "cancelled") {
            return res.status(404).json({ message: "Booking cancelled" });
        }

        return res.status(200).json({
            booking: {
                id: row.id,
                status: row.status,
                product_type: row.product_type,
                listing_id: row.listing_id,
                price: row.price,
                payment_status: row.payment_status,
                ac_type: row.ac_type,
                car_type: row.car_type,
                transfer_type: row.transfer_type,
                terminal: row.terminal,
                guest_count: row.guest_count,
                date: row.date,
                time: row.time,
                created_at: row.created_at,
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