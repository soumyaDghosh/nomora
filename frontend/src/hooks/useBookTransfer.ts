import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import useAuthStore from "../store/authStore";
import useBookStore from "../store/bookStore";

interface BookTransferProps {
    product_type: string;
    transfer_type: string;
    terminal: string;
    date: string;
    time: string;
    guest_count: number | string;
    price: number;
}

interface BookTransferResult {
    success: boolean;
    bookingId?: string;
}

export default function useBookTransfer() {
    const { clearUser } = useAuthStore();
    const { shortBookings, setShortBookings } = useBookStore();

    const [loading, setLoading] = useState(false);

    const bookTransfer = async ({
        product_type,
        transfer_type,
        terminal,
        date,
        time,
        guest_count,
        price
    }: BookTransferProps): Promise<BookTransferResult> => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/book`,
                {
                    product_type,
                    transfer_type,
                    terminal,
                    date,
                    time,
                    guest_count,
                    price
                },
                { withCredentials: true }
            );

            const result = response.data;
            if (!result.authenticated) {
                clearUser();
                return { success: false };
            }

            const newBooking = result.booking;
            setShortBookings([newBooking, ...shortBookings]);
            toast.success(result.message);

            return {
                success: true,
                bookingId: newBooking.id
            };
        }
        catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message || "Failed to book");
            return { success: false };
        }
        finally {
            setLoading(false);
        }
    };

    return { loading, bookTransfer };
}