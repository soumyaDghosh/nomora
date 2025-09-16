import { useCallback, useEffect, useRef, useState } from "react";
import usePWAStore from "../store/pwaStore";
import useAuthStore from "../store/authStore";

interface PopupProps {
    top?: number;
    bottom?: number;
    timeout?: number;
    welcomePage?: boolean;
    bookingPage?: boolean;
}

const TRANSITION_MS = 500;

const PWAPopup = ({ top, bottom, timeout, welcomePage, bookingPage }: PopupProps) => {
    const { hotel } = useAuthStore();
    const { deferredPrompt, clearDeferredPrompt, isInstallable } = usePWAStore();

    const [mounted, setMounted] = useState(false);
    const [visible, setVisible] = useState(false);

    const openTimerRef = useRef<number | null>(null);
    const unmountTimerRef = useRef<number | null>(null);
    const autoCloseRef = useRef<number | null>(null);
    const rafRef = useRef<number | null>(null);

    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        navigator.standalone === true;

    const closePopup = useCallback((persistSessionStorage: boolean) => {
        if (autoCloseRef.current) {
            clearTimeout(autoCloseRef.current);
            autoCloseRef.current = null;
        }

        setVisible(false);

        if (persistSessionStorage) {
            sessionStorage.setItem(bookingPage ? "bookingPopupClosed" : "popupClosed", "true");
        }

        if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
        unmountTimerRef.current = window.setTimeout(() => {
            setMounted(false);
            unmountTimerRef.current = null;
        }, TRANSITION_MS);
    }, [bookingPage]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            clearDeferredPrompt();
            closePopup(false);
        }
    };

    const handleClose = () => closePopup(true);

    useEffect(() => {
        if (!isInstallable || isStandalone) return;

        const closed =
            bookingPage
                ? sessionStorage.getItem("bookingPopupClosed")
                : sessionStorage.getItem("bookingPopupClosed") || sessionStorage.getItem("popupClosed");

        if (closed) return;

        openTimerRef.current = window.setTimeout(() => {
            setMounted(true);
        }, timeout ?? 2000);

        return () => {
            if (openTimerRef.current) {
                clearTimeout(openTimerRef.current);
                openTimerRef.current = null;
            }
        };
    }, [isInstallable, isStandalone, bookingPage, timeout]);

    useEffect(() => {
        if (!mounted) return;

        rafRef.current = requestAnimationFrame(() => {
            setVisible(true);
            rafRef.current = null;
        });

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, [mounted]);

    useEffect(() => {
        if (welcomePage && visible) {
            autoCloseRef.current = window.setTimeout(() => {
                closePopup(false);
            }, 5000);

            return () => {
                if (autoCloseRef.current) {
                    clearTimeout(autoCloseRef.current);
                    autoCloseRef.current = null;
                }
            };
        }
    }, [welcomePage, visible, closePopup]);

    useEffect(() => {
        return () => {
            if (openTimerRef.current) clearTimeout(openTimerRef.current);
            if (unmountTimerRef.current) clearTimeout(unmountTimerRef.current);
            if (autoCloseRef.current) clearTimeout(autoCloseRef.current);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    if (!mounted) return null;

    let translateClass = "";
    if (top !== undefined) {
        translateClass = visible ? "translate-y-0" : "-translate-y-full";
    } else if (bottom !== undefined) {
        translateClass = visible ? "translate-y-0" : "translate-y-full";
    } else {
        translateClass = visible ? "translate-y-0" : "translate-y-full";
    }

    return (
        <div
            className={`fixed left-0 right-0 z-30 transform transition-transform duration-500 ${translateClass}`}
            style={{ top: top ?? "auto", bottom: bottom ?? "auto" }}
        >
            <div className="mx-4 sm:mx-auto sm:max-w-sm sm:w-full relative my-2 py-4 px-3 flex items-end justify-between bg-white border border-gray-200 shadow-lg rounded-2xl">
                <div className="flex items-center gap-2">
                    <img src="/icons/9.png" alt="Nomora logo" className="w-12 h-12 rounded-xl" />
                    <div>
                        <h3 className="text-gray-900 font-semibold">Nomora</h3>
                        <p className="text-gray-600 text-sm">Install Nomora on your device</p>
                    </div>
                </div>

                <div className="relative">
                    <div className="px-4 py-2 bg-[#1e293b] text-white rounded-lg text-sm font-medium cursor-pointer">Install</div>
                    <button
                        id="pwaInstall"
                        onClick={handleInstallClick}
                        className="absolute inset-0 text-transparent cursor-pointer"
                    >
                        PWA Install ({hotel?.display_name})
                    </button>
                </div>

                <button onClick={handleClose} className="absolute top-0 right-1 text-gray-500 hover:text-gray-700 cursor-pointer">
                    <i className="ri-close-line text-lg" />
                </button>
            </div>
        </div>
    )
}

export default PWAPopup