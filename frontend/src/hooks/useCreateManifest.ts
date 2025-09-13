import { useCallback } from "react";
import { type Hotel } from "../store/authStore";

export default function useCreateManifest() {
    const createManifest = useCallback((hotel: Hotel) => {
        const manifest = {
            name: `${hotel.display_name} | Nomora`,
            short_name: hotel.display_name,
            start_url: `/${hotel.id}`,
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#1e293b",
            icons: [
                {
                    src: "/icons/icon-192.png",
                    sizes: "192x192",
                    type: "image/png",
                    purpose: "any maskable"
                },
                {
                    src: "/icons/icon-512.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "any maskable"
                }
            ]
        };

        const blob = new Blob([JSON.stringify(manifest)], {
            type: "application/json"
        });
        const manifestURL = URL.createObjectURL(blob);

        const oldLink = document.querySelector("link[rel='manifest']");
        if (oldLink) oldLink.remove();

        const link = document.createElement("link");
        link.rel = "manifest";
        link.href = manifestURL;
        document.head.appendChild(link);
    }, []);

    return { createManifest };
}