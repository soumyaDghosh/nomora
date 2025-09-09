import { useCallback, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import useBookStore from "../store/bookStore";

export default function useFetchBookings() {
    const { setShortBookings } = useBookStore();

    const [loading, setLoading] = useState(false);

    const fetchBookings = useCallback(async (): Promise<string[]> => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/book`,
                { withCredentials: true }
            );

            setShortBookings(response.data.bookings);
            return response.data.bookings.map((b: { id: string }) => b.id);
        }
        catch {
            toast.error("Failed to fetch bookings");
            return [];
        }
        finally {
            setLoading(false);
        }
    }, [setShortBookings]);

    return { loading, fetchBookings };
}