import { create } from "zustand";
import type { BeforeInstallPromptEvent } from "../types";

interface PWAState {
    deferredPrompt: BeforeInstallPromptEvent | null;
    isInstallable: boolean;
    setDeferredPrompt: (e: BeforeInstallPromptEvent) => void;
    clearDeferredPrompt: () => void;
}

const usePWAStore = create<PWAState>((set) => ({
    deferredPrompt: null,
    isInstallable: false,
    setDeferredPrompt: (e) =>
        set({ deferredPrompt: e, isInstallable: true }),
    clearDeferredPrompt: () =>
        set({ deferredPrompt: null, isInstallable: false }),
}));

export default usePWAStore;