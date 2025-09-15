import { useCallback } from "react";
import { type Hotel } from "../store/authStore";

export default function useCreateManifest() {
    const createManifest = useCallback((hotel: Hotel) => {
        const origin = window.location.origin;

        const manifest = {
            id: `/${hotel.id}`,
            name: "Nomora",
            short_name: "Nomora",
            description: `${hotel.display_name} | Sightseeing, tourist activities, and cab services with high-quality, private chauffeurs. Seamless travel, no planning required.`,
            start_url: `${origin}/${hotel.id}`,
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#1e293b",
            icons: [
                {
                    "purpose": "maskable",
                    "sizes": "48x48",
                    "src": `${origin}/icons/9.png`,
                    "type": "image/png"
                },
                {
                    "purpose": "maskable",
                    "sizes": "72x72",
                    "src": `${origin}/icons/10.png`,
                    "type": "image/png"
                },
                {
                    "purpose": "maskable",
                    "sizes": "96x96",
                    "src": `${origin}/icons/11.png`,
                    "type": "image/png"
                },
                {
                    "src": `${origin}/icons/2.png`,
                    "sizes": "36x36",
                    "type": "image/png",
                    "density": "0.75"
                },
                {
                    "src": `${origin}/icons/3.png`,
                    "sizes": "48x48",
                    "type": "image/png",
                    "density": "1.0"
                },
                {
                    "src": `${origin}/icons/4.png`,
                    "sizes": "72x72",
                    "type": "image/png",
                    "density": "1.5"
                },
                {
                    "src": `${origin}/icons/5.png`,
                    "sizes": "96x96",
                    "type": "image/png",
                    "density": "2.0"
                },
                {
                    "src": `${origin}/icons/6.png`,
                    "sizes": "144x144",
                    "type": "image/png",
                    "density": "3.0"
                },
                // {
                //     "src": `${origin}/icons/7.png`,
                //     "sizes": "192x192",
                //     "type": "image/png",
                //     "density": "4.0"
                // },
                // {
                //     "src": `${origin}/icons/8.png`,
                //     "sizes": "512x512",
                //     "type": "image/png",
                //     "density": "5.0"
                // }
            ],
            screenshots: [
                {
                    src: `${origin}/screenshots/mobile-1.png`,
                    sizes: "800x1600",
                    type: "image/png"
                    // form_factor: "narrow"
                },
                {
                    src: `${origin}/screenshots/mobile-2.png`,
                    sizes: "800x1600",
                    type: "image/png"
                },
                {
                    src: `${origin}/screenshots/mobile-3.png`,
                    sizes: "800x1600",
                    type: "image/png"
                },
                {
                    src: `${origin}/screenshots/mobile-4.png`,
                    sizes: "800x1600",
                    type: "image/png"
                },
                {
                    src: `${origin}/screenshots/desktop.png`,
                    sizes: "3840x2160",
                    type: "image/png",
                    form_factor: "wide"
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