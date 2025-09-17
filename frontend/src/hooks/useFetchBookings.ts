import { useCallback } from "react";
import axios, { AxiosError } from "axios";
import useBookStore from "../store/bookStore";

export default function useFetchBookings() {
    const { setShortBookings, setLoadingBookings } = useBookStore();

    const fetchBookings = useCallback(async (): Promise<string[]> => {
        try {
            setLoadingBookings(true);

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/booking/list`,
                { withCredentials: true }
            );
            const bookings = response.data.bookings;

            setShortBookings(bookings);
            return bookings.map((b: { id: string }) => b.id);
        }
        catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            console.log(error.response?.data?.message || "Failed to fetch bookings");
            return [];
        }
        finally {
            setLoadingBookings(false);
        }
    }, [setLoadingBookings, setShortBookings]);

    return { fetchBookings };
}