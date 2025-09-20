import { Request, Response } from "express";
import { DatabaseError } from "pg";
import { pool } from "../../config/db";

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
        if (row.status === "cancelled") {
            return res.status(404).json({ message: "Booking cancelled" });
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