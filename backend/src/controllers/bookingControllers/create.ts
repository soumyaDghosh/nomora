import { Request, Response } from "express";
import { DatabaseError } from "pg";
import crypto from "crypto";
import { pool } from "../../config/db";
import { getPaymentOrder } from "../../services/payment";
import { validateDate, validateTime } from "../../utils/validateDateTime";
import { validateTripWindow, validateTransferWindow } from "../../utils/validateTrip";

const ALLOWED_PRODUCT_TYPES = [
    "sameday",
    "city_sightseeing",
    "airport_transfer",
    "overnight",
    "experiences",
] as const;

export default async function createBooking(req: Request, res: Response) {
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

            const windowError = validateTransferWindow(date, time);
            if (windowError) return res.status(400).json({ message: windowError });
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
                        AND status IN ('created', 'allocated', 'confirmed', 'assigned')
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
                        AND status IN ('created', 'allocated', 'confirmed', 'assigned')
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