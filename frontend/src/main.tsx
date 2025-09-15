import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import { initGA } from "./lib/analytics.ts";
import App from "./App.tsx"
import "./App.css"

initGA();

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <App />
        <Toaster
            duration={5000}
            position="bottom-center"
            toastOptions={{
                style: {
                    display: "flex",
                    justifyContent: "center"
                }
            }}
        />
    </BrowserRouter>
)