import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

interface BookTourProps {
    product_type: string;
    listing_id: string;
    price: number;
    trip_details: {
        hotel_id: string;
        ac_type: string;
        car_type: string;
        date: string;
        time: string;
    };
}

interface BookTourResult {
    success: boolean;
    bookingId?: string;
}

export default function useBookTour() {
    const [loading, setLoading] = useState(false);

    const bookTour = async ({
        product_type,
        listing_id,
        price,
        trip_details
    }: BookTourProps): Promise<BookTourResult> => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/book`,
                {
                    product_type,
                    listing_id,
                    price,
                    trip_details
                },
                { withCredentials: true }
            );

            toast.success(response.data.message);

            return {
                success: true,
                bookingId: response.data.bookingId ?? null
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

    return { loading, bookTour };
}