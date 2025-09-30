import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

export default function useVerifyOtp() {
    const [loading, setLoading] = useState(false);
    const hotelId = useParams().hotelId;
    const verifyOtp = async (
        phone: string,
        otp: string
    ): Promise<boolean> => {
        try {
            setLoading(true);

            const res = await axios.post<{ message: string }>(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/otp/verify`,
                { phone, otp ,hotelId},
                { withCredentials: true }
            );

            toast.success(res.data.message || "OTP verified successfully");
            return true;
        }
        catch {
            return false;
        }
        finally {
            setLoading(false);
        }
    };

    return { loading, verifyOtp };
}