import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import useBookStore from "../store/bookStore";

export default function useFetchBooking() {
    const { longBookings, setLongBookings } = useBookStore();

    const [loading, setLoading] = useState(false);

    const fetchBooking = useCallback(async (bookingId?: string) => {
        if (!bookingId) return;

        try {
            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/book/${bookingId}`,
                { withCredentials: true }
            );

            setLongBookings([response.data.booking, ...longBookings]);
        }
        catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            console.log(error.response?.data?.message || "Failed to fetch booking");
        }
        finally {
            setLoading(false);
        }
    }, [longBookings, setLongBookings]);

    return { loading, fetchBooking };
}