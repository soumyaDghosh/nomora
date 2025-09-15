import { useEffect, useState } from "react";
import usePWAStore from "../store/pwaStore";

export default function PWAPopup() {
    const { deferredPrompt, clearDeferredPrompt, isInstallable } = usePWAStore();
    const [show, setShow] = useState(false);

    const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        navigator.standalone === true;

    useEffect(() => {
        if (!isInstallable || isStandalone) return;

        const timer = setTimeout(() => {
            setShow(true);
        }, 2000);

        return () => clearTimeout(timer);
    }, [isInstallable, isStandalone]);

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
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-[77px] left-0 right-0 z-50">
            <div className="relative mx-2 mb-2 rounded-2xl bg-white shadow-lg py-4 px-3 flex items-end justify-between">
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
                            Install Nomora in your mobile
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleInstallClick}
                    className="px-4 py-2 bg-[#1e293b] text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                >
                    Install
                </button>

                <button
                    onClick={handleClose}
                    className="absolute top-0 right-1 text-gray-500 hover:text-gray-700"
                >
                    <i className="ri-close-line text-lg" />
                </button>
            </div>
        </div>
    )
}