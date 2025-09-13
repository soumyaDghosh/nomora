import { useParams, useNavigate } from "react-router-dom";
import useBookStore from "../store/bookStore";
import BookingStateCard from "../components/BookingStateCard";

export default function Bookings() {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();

    const { shortBookings, loadingBookings } = useBookStore();

    return (
        <div className="min-h-[100svh] bg-gray-50">
            {/* Header */}
            <div className="bg-white px-4 py-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold text-gray-900">
                        My Bookings
                    </h1>
                    <button
                        onClick={() => navigate(`/${hotelId}/support`)}
                        className="flex items-center gap-2 bg-white hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <i className="ri-headphone-line text-xl text-gray-700" />
                        <span className="text-xs font-medium text-gray-600">24/7</span>
                    </button>
                </div>
            </div>

            <div className="mb-6 pt-6 pb-[calc(81px)]">
                {loadingBookings ? <LoadingState />
                    : (shortBookings && shortBookings.length > 0) ? (
                        <div className="px-4 space-y-5">
                            {shortBookings.map((booking) => (
                                <BookingStateCard
                                    key={booking.id}
                                    booking={booking}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="px-4">
                            <div className="bg-white rounded-2xl p-6 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <i className="ri-calendar-line text-gray-400 text-2xl"></i>
                                </div>
                                <h3 className="font-semibold text-gray-900 mb-2">No bookings yet</h3>
                                <p className="text-gray-600 text-sm">
                                    Your upcoming trips and experiences will appear here
                                </p>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    )
}

const LoadingState = () => (
    <div className="px-4 space-y-5">
        {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="px-6 py-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="w-16 h-6 bg-gray-200 rounded-full"></div>
                        <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
                <div className="p-6">
                    <div className="flex gap-4 mb-5">
                        <div className="w-24 h-24 bg-gray-200 rounded-xl"></div>
                        <div className="flex-1 space-y-2">
                            <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                            <div className="w-1/2 h-7 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                            <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                            <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-5 h-5 bg-gray-200 rounded"></div>
                            <div className="w-full h-4 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <div className="w-32 h-10 bg-gray-200 rounded-xl"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
)