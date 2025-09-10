import { useCallback } from "react";
import axios from "axios";
import { toast } from "sonner";
import useBookStore from "../store/bookStore";

export default function useFetchBookings() {
    const { setShortBookings, setLoadingBookings, setLoadingBookingId } = useBookStore();

    const fetchBookings = useCallback(async (): Promise<string[]> => {
        try {
            setLoadingBookings(true);

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/book`,
                { withCredentials: true }
            );
            const bookings = response.data.bookings;

            if (!bookings.length) setLoadingBookingId(null);
            setShortBookings(bookings);
            return bookings.map((b: { id: string }) => b.id);
        }
        catch {
            toast.error("Failed to fetch bookings");
            return [];
        }
        finally {
            setLoadingBookings(false);
        }
    }, [setLoadingBookings, setShortBookings, setLoadingBookingId]);

    return { fetchBookings };
}