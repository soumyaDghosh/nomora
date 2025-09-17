import { useState, useCallback } from "react";
import axios, { AxiosError } from "axios";
import useBookStore, { type MyBooking } from "../store/bookStore";

export default function useFetchBooking() {
    const { longBookings, setLongBookings } = useBookStore();

    const [loading, setLoading] = useState(true);

    const fetchBooking = useCallback(async (bookingId?: string): Promise<void> => {
        if (!bookingId) return;

        const alreadyFetched = longBookings.some((b) => b.id === bookingId);
        if (alreadyFetched) {
            setLoading(false);
            return;
        }

        try {
            const response = await axios.get<{ booking: MyBooking }>(
                `${import.meta.env.VITE_SERVER_URL}/api/booking/details?booking_id=${bookingId}`,
                { withCredentials: true }
            );

            setLongBookings((prev) => [response.data.booking, ...prev]);
        }
        catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            console.log(error.response?.data?.message || "Failed to fetch booking details");
        }
        finally {
            setLoading(false);
        }
    }, [longBookings, setLongBookings]);

    return { loading, setLoading, fetchBooking };
}