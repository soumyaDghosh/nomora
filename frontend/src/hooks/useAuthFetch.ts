import { useCallback } from "react";
import axios from "axios";
import useCreateManifest from "./useCreateManifest";
import useAuthStore from "../store/authStore";

export default function useAuthFetch() {
    const { createManifest } = useCreateManifest();

    const { setHotel, setUser, clearUser, setAuthenticating, setAuthenticated } = useAuthStore();

    const fetchUser = useCallback(async (): Promise<boolean> => {
        try {
            const hotelId = window.location.pathname.split("/")[1];

            const res = await axios.get(
                `${import.meta.env.VITE_SERVER_URL}/api/auth/user/${hotelId}`,
                { withCredentials: true }
            );

            if (res.data.hotel) {
                setHotel(res.data.hotel);
                createManifest(res.data.hotel);
            }

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
    }, [setAuthenticating, setHotel, setUser, setAuthenticated, createManifest, clearUser]);

    return { fetchUser };
}