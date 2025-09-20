import { parseDateTime } from "./parseDateTime";

export default function validateTripWindow(date: string, time: string): string | null {
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