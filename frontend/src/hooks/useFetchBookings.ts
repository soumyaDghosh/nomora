import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import useBookStore from "../store/bookStore";

export default function useFetchBookings() {
    const { setBookings } = useBookStore();

    const [loading, setLoading] = useState(false);

    const fetchBookings = useCallback(async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/book`,
                { withCredentials: true }
            );

            setBookings(response.data.bookings);
        }
        catch {
            toast.error("Failed to fetch bookings");
            return { success: false };
        }
        finally {
            setLoading(false);
        }
    }, [setBookings]);

    return { loading, fetchBookings };
}