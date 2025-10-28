import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import useCreatePayment from "./useCreatePayment";

interface BookTransferProps {
    product_type: string;
    transfer_type: string;
    terminal: string;
    date: string;
    time: string;
    guest_count: number;
    price: number;
}

interface BookTransferResult {
    success: boolean;
    bookingId?: string;
}

export default function useBookTransfer() {
    const { createPayment } = useCreatePayment();

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
                `${import.meta.env.VITE_SERVER_URL}/api/booking/create`,
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

            const { environment, booking_id, order_id, order_amount } = response.data;
            const success = await createPayment({ environment, booking_id, order_id, order_amount });

            if (success) {
                return {
                    success: true,
                    bookingId: booking_id
                };
            }

            return { success: false };
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