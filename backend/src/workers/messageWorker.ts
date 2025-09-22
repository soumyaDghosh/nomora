import { messageQueue } from "../queues/messageQueue";
import { sendWhatsAppMessage } from "../services/message";

messageQueue.isReady().then(() => {
    console.log("Message worker running");
}).catch((err) => {
    console.error("Failed to connect:", err);
});

messageQueue.process("guest_airport_assignment_reminder", async (job) => {
    const { bookingId, phone, bookingDate, bookingTime, transferType, hotelName, terminal } = job.data;

    await sendWhatsAppMessage("guest_airport_assignment_reminder", phone, {
        body_1: { type: "text", value: `${bookingDate}, ${bookingTime}` },
        body_2: {
            type: "text",
            value: transferType === "Drop to Airport" ? hotelName : `${terminal}, KIA Bengaluru`
        }
    });

    console.log(`guest_airport_assignment_reminder sent to ${phone} for booking id ${bookingId}`);
});

messageQueue.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

messageQueue.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err);
});