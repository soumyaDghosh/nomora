import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export default function useSendOtp() {
    const [loading, setLoading] = useState(false);

    const sendOtp = async (phone: string): Promise<boolean> => {
        try {
            setLoading(true);

            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/otp/send`,
                { phone }
            );

            toast.info("OTP sent to your phone");
            return true;
        }
        catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message || "Failed to send OTP");
            return false;
        }
        finally {
            setLoading(false);
        }
    };

    return { loading, sendOtp };
}