import { useState } from "react";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export default function useSignOut() {
    const [loading, setLoading] = useState(false);

    const signOut = async (): Promise<boolean> => {
        try {
            setLoading(true);

            await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
                { withCredentials: true }
            );

            toast.info("Logged out");
            return true;
        }
        catch (err) {
            const error = err as AxiosError<{ message?: string }>;
            toast.error(error.response?.data?.message || "Failed to logout");
            return false;
        }
        finally {
            setLoading(false);
        }
    };

    return { loading, signOut };
}