import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import useCreatePayment from "./useCreatePayment";

interface BookTourProps {
    product_type: string;
    car_type: string;
    date: string;
    time: string;
    price: number;
    listing_id: string;
    guest_count: number;
}

interface BookTourResult {
    success: boolean;
    bookingId?: string;
}

export default function useBookTour() {
    const { createPayment } = useCreatePayment();

    const [loading, setLoading] = useState(false);

    const bookTour = async ({
        product_type,
        car_type,
        date,
        time,
        price,
        listing_id,
        guest_count
    }: BookTourProps): Promise<BookTourResult> => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/booking/create`,
                {
                    product_type,
                    car_type,
                    date,
                    time,
                    price,
                    listing_id,
                    guest_count
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

    return { loading, bookTour };
}