import { useParams, useNavigate, Link } from "react-router-dom";
import { tripData } from "../data/tripData";
import useAuthStore from "../store/authStore";
import type { MyBooking } from "../store/bookStore";
import { formatPrice } from "../utils/formatPrice";
import { formatDate } from "../utils/formatDate";
import { getVehicleSeat } from "../utils/getVehicleSeat";
import { getPaymentStatusConfig } from "../utils/paymentStatus";

interface BookingStateCardProps {
    booking: MyBooking;
}

const BookingStateCard = ({ booking }: BookingStateCardProps) => {
    const { hotelId } = useParams<{ hotelId: string }>();
    const navigate = useNavigate();

    const { hotel } = useAuthStore();

    const trip = tripData[booking.listing_id ?? ""];
    const isAirportTransfer = booking.product_type === "airport_transfer";

    const getStateConfig = (state: string) => {
        switch (state) {
            case "processing":
                return {
                    label: "Processing",
                    bgColor: "bg-orange-100",
                    textColor: "text-orange-800",
                    showViewDetails: false
                };
            case "ongoing":
                return {
                    label: "Ongoing",
                    bgColor: "bg-blue-100",
                    textColor: "text-blue-800",
                    showViewDetails: true
                };
            case "completed":
                return {
                    label: "Completed",
                    bgColor: "bg-green-100",
                    textColor: "text-green-800",
                    showViewDetails: true
                };
            case "cancelled":
                return {
                    label: "Cancelled",
                    bgColor: "bg-red-100",
                    textColor: "text-red-800",
                    showViewDetails: false
                };
            default:
                return {
                    label: "Unknown",
                    bgColor: "bg-gray-100",
                    textColor: "text-gray-800",
                    showViewDetails: false
                };
        }
    };

    const stateConfig = getStateConfig(booking.status);
    const paymentConfig = getPaymentStatusConfig(booking.payment_status);

    const handleCardClick = () => {
        if (!stateConfig.showViewDetails) return;
        navigate(`/${hotelId}/confirmation/${booking.id}`);
    };

    return (
        <div
            className={`bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden ${stateConfig.showViewDetails ? "cursor-pointer" : ""}`}
            onClick={handleCardClick}
        >
            {/* Single unified card with improved spacing */}
            <div className="p-5">
                {/* Status badges at top with proper spacing */}
                <div className="flex items-center justify-between mb-5">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${stateConfig.bgColor} ${stateConfig.textColor}`}>
                        {stateConfig.label}
                    </span>
                    <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${paymentConfig.bgColor} ${paymentConfig.textColor}`}>
                        {paymentConfig.label}
                    </span>
                </div>

                {/* Trip Image and Title Section */}
                <div className="flex items-start gap-4 mb-5">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 shadow-sm">
                        <img
                            src={!isAirportTransfer ? trip.images[0].url : "https://readdy.ai/api/search-image?query=Bangalore%20BLR%20airport%20terminal%20modern%20architecture%20glass%20building%20aviation%20infrastructure%20Indian%20airport%20departure%20arrival%20gates&width=320&height=240&seq=blr-airport-terminal&orientation=landscape"}
                            alt=""
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+PHBhdGggZD0iTTQwIDI4YzIuMjA5IDAgNC0xLjc5MSA0LTRzLTEuNzkxLTQtNC00LTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0ek0yOCA0MGwxMi0xMiAxMiAxMnYxMkgyOFY0MHoiIGZpbGw9IiM5Q0E5QjMiLz48L3N2Zz4=";
                            }}
                        />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-base leading-tight mb-2 line-clamp-2">
                            {isAirportTransfer ? booking.transfer_type : trip.title}
                        </h3>
                        <div className="text-lg font-semibold text-gray-900">
                            {formatPrice(booking.price)}
                        </div>
                    </div>
                </div>

                {/* Trip Details Grid with improved spacing */}
                <div className="space-y-3">
                    {/* Date and Time Row - Fix hydration with suppressHydrationWarning */}
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            <i className="ri-calendar-line text-gray-400 text-sm" />
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="font-medium text-gray-900 text-sm" suppressHydrationWarning={true}>
                                {formatDate(booking.date)}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600 text-sm">
                                {booking.time}
                            </span>
                        </div>
                    </div>

                    {/* Duration/Terminal Row - UPDATED for airport transfers */}
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            {isAirportTransfer ? (
                                <i className="ri-flight-takeoff-line text-gray-400 text-sm" />
                            ) : (
                                <i className="ri-time-line text-gray-400 text-sm" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            {isAirportTransfer ? (
                                <span className="text-gray-700 text-sm">Terminal {booking?.terminal}</span>
                            ) : (
                                <span className="text-gray-700 text-sm">{trip.duration}</span>
                            )}
                        </div>
                    </div>

                    {/* Car Details Row */}
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                            <i className="ri-car-line text-gray-400 text-sm" />
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className="text-gray-700 text-sm">
                                {isAirportTransfer ? "Sedan" : booking?.car_type}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600 text-sm">
                                {isAirportTransfer ? "4+1 AC" : `${getVehicleSeat(booking?.car_type).split(" ")[0]} ${booking.ac_type}`}
                            </span>
                        </div>
                    </div>

                    {/* Location Row - UPDATED: Use hotel icon for airport transfers */}
                    <div className="flex items-center gap-3 text-gray-600">
                        <div className="w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {isAirportTransfer ? (
                                <i className="ri-hotel-line text-gray-400 text-sm" />
                            ) : (
                                <i className="ri-map-pin-line text-gray-400 text-sm" />
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="text-gray-700 text-sm break-words leading-relaxed" style={{
                                wordBreak: "break-word",
                                overflowWrap: "break-word",
                                hyphens: "auto"
                            }}>
                                {hotel?.display_name}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Action Button - Only for Ongoing & Completed states */}
                {stateConfig.showViewDetails && (
                    <div className="flex justify-end mt-5">
                        <Link
                            to={`/${hotelId}/confirmation/${booking.id}`}
                            className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span>View Details</span>
                            <i className="ri-arrow-right-line" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BookingStateCard