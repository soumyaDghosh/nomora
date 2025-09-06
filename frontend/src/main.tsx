import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import { Toaster } from "sonner"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
    <BrowserRouter>
        <App />
        <Toaster
            duration={5000}
            position="top-right"
            richColors
            closeButton
        />
    </BrowserRouter>
)