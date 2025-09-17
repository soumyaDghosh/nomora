import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import useBookStore from "../store/bookStore";

interface VerifyPaymentProps {
    booking_id: string;
    order_id: string;
    payment_id?: string
}

export default function useVerifyPayment() {
    const { shortBookings, setShortBookings } = useBookStore();

    const verifyPayment = async ({ booking_id, order_id, payment_id }: VerifyPaymentProps): Promise<boolean> => {
        const toastId = toast.loading("Verifying payment...");

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/booking/verify`,
                { booking_id, order_id, payment_id },
                { withCredentials: true }
            );

            const newBooking = response.data.booking;
            setShortBookings([newBooking, ...shortBookings]);
            toast.success("Booked successfully");

            return true;
        }
        catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message || "Failed to verify payment");
            return false;
        }
        finally {
            toast.dismiss(toastId);
        }
    };

    return { verifyPayment };
}