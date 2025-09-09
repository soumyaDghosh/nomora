import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import useBookStore, { type MyBooking } from "../store/bookStore";

export default function useFetchBooking() {
    const { setLongBookings, setLoadingBookingId } = useBookStore();

    const fetchBooking = useCallback(async (bookingId?: string): Promise<void> => {
        if (!bookingId) return;

        try {
            setLoadingBookingId(bookingId);

            const response = await axios.get<{ booking: MyBooking }>(
                `${import.meta.env.VITE_SERVER_URL}/api/book/${bookingId}`,
                { withCredentials: true }
            );

            setLongBookings((prev) => [response.data.booking, ...prev]);
        }
        catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            console.log(error.response?.data?.message || "Failed to fetch booking");
        }
        finally {
            setLoadingBookingId(null);
        }
    }, [setLongBookings, setLoadingBookingId]);

    return { fetchBooking };
}