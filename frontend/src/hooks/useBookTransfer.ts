import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import useBookStore from "../store/bookStore";

interface BookTransferProps {
    product_type: string;
    listing_id: string;
    price: number;
    transfer_details: {
        type: string;
        from_location: string;
        to_location: string;
        terminal: string;
        date: string;
        time: string;
        guest_count: number | string;
    };
}

interface BookTransferResult {
    success: boolean;
    bookingId?: string;
}

export default function useBookTransfer() {
    const { shortBookings, setShortBookings } = useBookStore();

    const [loading, setLoading] = useState(false);

    const bookTransfer = async ({
        product_type,
        listing_id,
        price,
        transfer_details,
    }: BookTransferProps): Promise<BookTransferResult> => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/book`,
                {
                    product_type,
                    listing_id,
                    price,
                    transfer_details
                },
                { withCredentials: true }
            );
            const newBooking = response.data.booking;

            setShortBookings([newBooking, ...shortBookings]);
            toast.success(response.data.message);

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