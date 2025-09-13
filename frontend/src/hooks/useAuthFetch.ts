import { useCallback } from "react";
import axios from "axios";
import useAuthStore from "../store/authStore";

export default function useAuthFetch() {
    const { setHotel, setUser, clearUser, setAuthenticating, setAuthenticated } = useAuthStore();

    const fetchUser = useCallback(async (): Promise<boolean> => {
        try {
            const hotelId = window.location.pathname.split("/")[1];

            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/user/${hotelId}`,
                { withCredentials: true }
            );

            setHotel(res.data.hotel);

            if (res.data.user) {
                localStorage.setItem("doneAuth", "true");
                setUser(res.data.user);
                setAuthenticated(true);
                return true;
            }
            else {
                clearUser();
                return false;
            }
        }
        catch {
            clearUser();
            return false;
        }
        finally {
            setAuthenticating(false);
        }
    }, [setAuthenticating, setHotel, setUser, setAuthenticated, clearUser]);

    return { fetchUser };
}