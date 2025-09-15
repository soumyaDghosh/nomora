import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import useBookStore from "../store/bookStore";

interface BookTourProps {
    product_type: string;
    ac_type: string;
    car_type: string;
    date: string;
    time: string;
    price: number;
    listing_id: string;
}

interface BookTourResult {
    success: boolean;
    bookingId?: string;
}

export default function useBookTour() {
    const { shortBookings, setShortBookings } = useBookStore();

    const [loading, setLoading] = useState(false);

    const bookTour = async ({
        product_type,
        ac_type,
        car_type,
        date,
        time,
        price,
        listing_id
    }: BookTourProps): Promise<BookTourResult> => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/booking`,
                {
                    product_type,
                    ac_type,
                    car_type,
                    date,
                    time,
                    price,
                    listing_id
                },
                { withCredentials: true }
            );
            const result = response.data;

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

    return { loading, bookTour };
}