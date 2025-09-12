import { useNavigate } from "react-router-dom";

export function HotelNotFound() {
    return (
        <div className="min-h-[100svh] bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Hotel Not Found</h2>
                <p className="text-gray-600 mb-4">The requested page could not be found.</p>
            </div>
        </div>
    )
}

export function NotFound() {
    const navigate = useNavigate();

    return (
        <div className="min-h-[100svh] bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Page Not Found</h2>
                <p className="text-gray-600 mb-4">The requested page could not be found.</p>
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-800 text-white px-4 py-2 rounded-xl cursor-pointer"
                >
                    Go Back
                </button>
            </div>
        </div>
    )
}