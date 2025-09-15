import { useEffect, useState } from "react";
import usePWAStore from "../store/pwaStore";

interface PopupProps {
    bottom?: number;
    timeout?: number;
}

const PWAPopup = ({ bottom, timeout }: PopupProps) => {
    const { deferredPrompt, clearDeferredPrompt, isInstallable } = usePWAStore();
    const [show, setShow] = useState(false);

    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        navigator.standalone === true;

    useEffect(() => {
        if (!isInstallable || isStandalone) return;

        const popupClosed = sessionStorage.getItem("popupClosed");
        if (popupClosed) return;

        const delay = timeout !== undefined ? timeout : 2000;
        const timer = setTimeout(() => {
            setShow(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [isInstallable, isStandalone, timeout]);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === "accepted") {
            clearDeferredPrompt();
            setShow(false);
        }
    };

    const handleClose = () => {
        setShow(false);
        sessionStorage.setItem("popupClosed", "true");
    };

    if (!show) return null;

    return (
        <div className="fixed left-0 right-0 z-50" style={{ bottom: bottom || 0 }}>
            <div className="mx-2 sm:mx-auto sm:max-w-sm sm:w-full relative mb-2 py-4 px-3 flex items-end justify-between bg-white border border-gray-200 shadow-lg rounded-2xl">
                <div className="flex items-center gap-2">
                    <img
                        src='/icons/9.png'
                        alt="Nomora logo"
                        className="w-12 h-12 rounded-xl"
                    />
                    <div>
                        <h3 className="text-gray-900 font-semibold">
                            Nomora
                        </h3>
                        <p className="text-gray-600 text-sm">
                            Install Nomora on your device
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-[#1e293b] text-white rounded-lg text-sm font-medium cursor-pointer"
                >
                    Install
                </button>

                <button
                    onClick={handleClose}
                    className="absolute top-0 right-1 text-gray-500 hover:text-gray-700 cursor-pointer"
                >
                    <i className="ri-close-line text-lg" />
                </button>
            </div>
        </div>
    )
}

export default PWAPopup