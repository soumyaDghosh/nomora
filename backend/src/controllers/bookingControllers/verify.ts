import { Request, Response } from "express";
import { DatabaseError } from "pg";
import axios from "axios";
import { pool } from "../../config/db";
import { getPaymentStatus } from "../../services/payment";
import { sendWhatsAppMessage } from "../../services/message";
import { formatBookingDate } from "../../utils/parseDateTime";
import getVehicleSeat from "../../utils/getVehicleSeat";
import { messageQueue } from "../../queues/messageQueue";
import { tripData } from "../../data/tripData";

export default async function verifyBooking(req: Request, res: Response) {
    const client = await pool.connect();

    try {
        const hotel_id = req.cookies?.hotel_id;
        const hotel_name = req.cookies?.hotel_name;
        const { environment, booking_id, order_id, payment_id } = req.body ?? {};

        if (!booking_id) return res.status(401).json({ message: "booking_id is required" });
        if (!order_id) return res.status(400).json({ message: "order_id is required" });

        await client.query("BEGIN");

        if (environment === "production") {
            const bookingResult = await client.query(
                `
                SELECT id, status, product_type, listing_id, price, payment_status, ac_type, car_type, transfer_type, terminal, guest_count, date, time
                FROM bookings
                WHERE id = $1
                `,
                [booking_id]
            );

            if (bookingResult.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({ message: "Booking not found" });
            }

            const booking = bookingResult.rows[0];

            return res.status(201).json({
                message: "Booked successfully",
                booking
            });
        }

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
                SET payment_status = 'advance-paid'
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
Date: ${formatBookingDate(booking.date)}<br />
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

            if (["sameday", "city_sightseeing"].includes(booking.product_type)) {
                const trip = tripData[booking.listing_id];
                sendWhatsAppMessage("guest_tour_booking_confirmation", req.user?.phone!, {
                    body_1: {
                        type: "text",
                        value: trip.title
                    },
                    body_2: {
                        type: "text",
                        value: trip.duration
                    },
                    body_3: {
                        type: "text",
                        value: `${formatBookingDate(booking.date)}, ${booking.time}`
                    },
                    body_4: {
                        type: "text",
                        value: hotel_name
                    },
                    body_5: {
                        type: "text",
                        value: `${booking.car_type}`
                    },
                    body_6: {
                        type: "text",
                        value: `${getVehicleSeat(booking.car_type)}`
                    },
                    body_7: {
                        type: "text",
                        value: `${booking.ac_type}`
                    },
                });

                await messageQueue.add(
                    "guest_tour_assignment_reminder",
                    {
                        bookingId: booking_id,
                        phone: req.user?.phone!,
                        title: trip.title,
                        duration: trip.duration,
                        bookingDateTime: `${formatBookingDate(booking.date)}, ${booking.time}`,
                        hotelName: hotel_name,
                        carType: booking.car_type,
                        carSeat: getVehicleSeat(booking.car_type),
                        acType: booking.ac_type
                    },
                    { delay: 10 * 1000, attempts: 1 }
                );
            }
            else if (booking.product_type === "airport_tranfer") {
                sendWhatsAppMessage("guest_airport_booking_confirmation", req.user?.phone!, {
                    body_1: {
                        type: "text",
                        value: `${formatBookingDate(booking.date)}, ${booking.time}`
                    },
                    body_2: {
                        type: "text",
                        value: booking.transfer_type === "Drop to Airport" ? hotel_name : `${booking.terminal}, KIA Bengaluru`
                    },
                });

                const bookingDateTime = new Date(
                    new Date(`${booking.date} ${booking.time}`).toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                );

                const nowIST = new Date(
                    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
                );

                const diffMs = bookingDateTime.getTime() - nowIST.getTime();
                const diffHours = diffMs / (1000 * 60 * 60);

                if (diffHours > 8) {
                    const delayHours = (diffHours - 4) / 2;
                    const delayMs = delayHours * 60 * 60 * 1000;

                    await messageQueue.add(
                        "guest_airport_assignment_reminder",
                        {
                            bookingId: booking_id,
                            phone: req.user?.phone!,
                            bookingDate: formatBookingDate(booking.date),
                            bookingTime: booking.time,
                            transferType: booking.transfer_type,
                            hotelName: hotel_name,
                            terminal: booking.terminal
                        },
                        { delay: delayMs, attempts: 1 }
                    );
                }
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