import "dotenv/config";
import { messageQueue } from "../queues/messageQueue";
import { pool } from "../config/db";
import { sendWhatsAppMessage } from "../services/message";

messageQueue.isReady()
    .then(() => console.log("Message worker running"))
    .catch((err) => console.error("Failed to connect to message queue:", err));

messageQueue.process("guest_tour_assignment_reminder", async (job) => {
    const { bookingId, phone, title, duration, bookingDateTime, hotelName, carType, carSeat, acType } = job.data;

    try {
        const result = await pool.query(
            "SELECT status FROM bookings WHERE id = $1",
            [bookingId]
        );

        if (result.rows.length === 0) {
            console.log(`Booking not found: ${bookingId}`);
            return;
        }

        if (result.rows[0].status !== "confirmed") {
            console.log(`Skipping message for booking ${bookingId} because status is '${result.rows[0].status}'`);
            return;
        }

        await sendWhatsAppMessage("guest_tour_assignment_reminder", phone, {
            body_1: { type: "text", value: title },
            body_2: { type: "text", value: duration },
            body_3: { type: "text", value: bookingDateTime },
            body_4: { type: "text", value: hotelName },
            body_5: { type: "text", value: carType },
            body_6: { type: "text", value: carSeat },
            body_7: { type: "text", value: acType },
        });

        console.log(`guest_tour_assignment_reminder sent to ${phone} for booking id ${bookingId}`);
    }
    catch (err) {
        console.error(`Error processing booking ${bookingId}:`, err);
        throw err;
    }
});

messageQueue.process("guest_airport_assignment_reminder", async (job) => {
    const { bookingId, phone, bookingDate, bookingTime, transferType, hotelName, terminal } = job.data;

    try {
        const result = await pool.query(
            "SELECT status FROM bookings WHERE id = $1",
            [bookingId]
        );

        if (result.rows.length === 0) {
            console.log(`Booking not found: ${bookingId}`);
            return;
        }

        if (result.rows[0].status !== "confirmed") {
            console.log(`Skipping message for booking ${bookingId} because status is '${result.rows[0].status}'`);
            return;
        }

        await sendWhatsAppMessage("guest_airport_assignment_reminder", phone, {
            body_1: { type: "text", value: `${bookingDate}, ${bookingTime}` },
            body_2: { type: "text", value: transferType === "Drop to Airport" ? hotelName : `${terminal}, KIA Bengaluru` },
        });

        console.log(`guest_airport_assignment_reminder sent to ${phone} for booking ${bookingId}`);
    }
    catch (err) {
        console.error(`Error processing booking ${bookingId}:`, err);
        throw err;
    }
});

messageQueue.on("completed", (job) => console.log(`Job ${job.id} completed`));
messageQueue.on("failed", (job, err) => console.error(`Job ${job.id} failed:`, err));