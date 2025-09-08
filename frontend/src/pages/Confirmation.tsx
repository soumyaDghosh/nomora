import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import useFetchBooking from "../hooks/useFetchBooking";
import AppLoader from "../components/Loader/AppLoader";
import { formatDate } from "../utils/formatDate";
import { formatPrice } from "../utils/formatPrice";
import { getVehicleSeat } from "../utils/getVehicleSeat";

export default function Confirmation() {
    const { bookingId } = useParams<{ bookingId: string }>();
    const navigate = useNavigate();

    const {
        loading,
        booking,
        isAirportTransfer,
        trip,
        transfer,
        fetchBooking
    } = useFetchBooking();

    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const [expandedSections, setExpandedSections] = useState({
        essential: false,
        accessibility: false,
        rules: false,
        weather: false
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    const toggleTooltip = (id: string) => {
        setActiveTooltip(activeTooltip === id ? null : id);
    };

    const getPricePart = (price: number, part: "base" | "tax") => {
        const base = Math.round(price / 1.05);
        const tax = Math.round(price - base);
        return formatPrice(part === "base" ? base : tax);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
                setActiveTooltip(null);
            }
        };

        if (activeTooltip) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [activeTooltip]);

    useEffect(() => {
        fetchBooking(bookingId);
    }, [bookingId, fetchBooking]);

    if (loading) {
        return <AppLoader />
    }
    else if (booking) {
        return (
            <div className="min-h-screen bg-gray-50 pb-24">
                {/* Header */}
                <div className="bg-white border-b border-gray-100 px-4 py-4 pt-8 sticky top-0 z-40">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-medium text-gray-900">
                                Booking Confirmation
                            </h1>
                        </div>
                        <button
                            onClick={() => navigate("/support")}
                            className="flex items-center gap-2 bg-white hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            <i className="ri-headphone-line text-xl text-gray-700"></i>
                            <span className="text-xs font-medium text-gray-600">24/7</span>
                        </button>
                    </div>
                </div>

                <div className="px-4 pt-6 space-y-6">
                    {/* Success Message */}
                    <div className="bg-gray-100 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                                <i className="ri-check-line text-white text-lg"></i>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">Booking Confirmed</h2>
                                <p className="flex flex-col sm:flex-row gap-1 text-xs sm:text-sm text-gray-700">
                                    <span>Booking ID:</span>
                                    <span>{bookingId}</span>
                                </p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 mb-4">
                            <h3 className="font-medium text-gray-900 mb-3">Scheduled Trip Details</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <i className="ri-calendar-line text-blue-600 w-5 h-5 flex items-center justify-center"></i>
                                    <span className="text-sm text-gray-700">
                                        {formatDate(isAirportTransfer ? booking.transfer_details?.date : booking.trip_details?.date)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <i className="ri-time-line text-blue-600 w-5 h-5 flex items-center justify-center"></i>
                                    <span className="text-sm text-gray-700">
                                        {isAirportTransfer ? booking.transfer_details?.time : booking.trip_details?.time}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-start gap-2">
                                <i className="ri-information-line text-gray-600 text-sm mt-0.5"></i>
                                <p className="text-sm text-gray-800">Chauffeur will be assigned within 30 mins.</p>
                            </div>
                            {isAirportTransfer && (
                                <div className="flex items-start gap-2">
                                    <i className="ri-map-pin-time-line text-gray-600 text-sm mt-0.5"></i>
                                    <p className="text-sm text-gray-800">Driver will be at pickup 15–30 mins ahead.</p>
                                </div>
                            )}
                            <div className="flex items-start gap-2">
                                <i className="ri-notification-line text-gray-600 text-sm mt-0.5"></i>
                                <p className="text-sm text-gray-800">Car and chauffeur details will be shared via notification.</p>
                            </div>
                        </div>
                    </div>

                    {/* Booking Details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <i className="ri-file-list-3-line text-blue-600 text-lg"></i>
                            <h3 className="font-semibold text-gray-900">Booking Details</h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                                    {isAirportTransfer
                                        ? booking.transfer_details?.type === "Drop to Airport"
                                            ? `Drop to ${booking.transfer_details?.to_location} Airport`
                                            : `Pickup from ${booking.transfer_details?.to_location} Airport`
                                        : trip?.title}
                                </h4>
                                {isAirportTransfer ? (
                                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <i className="ri-group-line text-gray-400 w-4 h-4 flex items-center justify-center"></i>
                                            <span>{booking.transfer_details?.guest_count} Guest{booking.transfer_details?.guest_count !== 1 ? "s" : ""}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-flight-takeoff-line text-gray-400 w-4 h-4 flex items-center justify-center"></i>
                                            <span>Terminal {booking.transfer_details?.terminal}</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <i className="ri-time-line text-gray-400 w-4 h-4 flex items-center justify-center"></i>
                                            <span>{trip?.duration}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-car-line text-gray-400 w-4 h-4 flex items-center justify-center"></i>
                                            <span>Private Car</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <i className="ri-map-pin-line text-gray-400 w-4 h-4 flex items-center justify-center"></i>
                                            <span>Pickup and Drop Included</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-start gap-3">
                                        <i className="ri-car-line text-blue-600 mt-0.5"></i>
                                        <div className="flex-1">
                                            <span className="text-gray-500 font-medium block mb-1">Car Category</span>
                                            <p className="font-medium text-gray-900">
                                                {isAirportTransfer ? "Comfort" : booking.trip_details?.car_type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 relative" ref={activeTooltip === "capacity-tooltip" ? tooltipRef : null}>
                                        <i className="ri-group-line text-green-600 mt-0.5"></i>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-gray-500 font-medium">Capacity</span>
                                                <button
                                                    onClick={() => toggleTooltip("capacity-tooltip")}
                                                    className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full cursor-pointer"
                                                >
                                                    <i className="ri-information-line text-xs"></i>
                                                </button>
                                            </div>
                                            <p className="font-medium text-gray-900">
                                                {isAirportTransfer ? "4+1 Seats" : getVehicleSeat(booking.trip_details?.car_type)}
                                            </p>
                                        </div>

                                        {activeTooltip === "capacity-tooltip" && (
                                            <div className="absolute top-full left-8 right-0 mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-20">
                                                <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                                                <div className="flex items-start gap-2">
                                                    <span className="flex-1 break-words leading-relaxed">+1 refers to the Chauffeur</span>
                                                    <button
                                                        onClick={() => setActiveTooltip(null)}
                                                        className="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-white flex-shrink-0 cursor-pointer"
                                                    >
                                                        <i className="ri-close-line text-xs"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <i className="ri-temp-cold-line text-blue-600 mt-0.5"></i>
                                        <div className="flex-1">
                                            <span className="text-gray-500 font-medium block mb-1">Comfort</span>
                                            <p className="font-medium text-gray-900">
                                                {isAirportTransfer ? "AC" : booking.trip_details?.ac_type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <i className="ri-hotel-line text-orange-600 mt-0.5"></i>
                                        <div className="flex-1">
                                            <span className="text-gray-500 font-medium block mb-1">
                                                {isAirportTransfer ?
                                                    booking.transfer_details?.type === "Pickup from Airport" ?
                                                        "Drop Location"
                                                        : "Pickup Location"
                                                    : "Pickup Location"}
                                            </span>
                                            <p className="font-medium text-gray-900 break-words leading-tight">
                                                {isAirportTransfer ?
                                                    booking.transfer_details?.type === "Pickup from Airport" ?
                                                        booking.transfer_details?.to_location
                                                        : booking.transfer_details?.from_location
                                                    : "Pickup Location"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!isAirportTransfer && (
                                <div className="border-t border-gray-100 pt-4">
                                    <Link
                                        to={`/trip/${booking.listing_id}`}
                                        className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                                    >
                                        <i className="ri-eye-line"></i>
                                        <span>View Full Itinerary</span>
                                        <i className="ri-arrow-right-line"></i>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <i className="ri-money-rupee-circle-line text-green-600 text-lg"></i>
                            <h3 className="font-semibold text-gray-900">Payment Details</h3>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Payment Status</span>
                                <span className={`text-sm font-medium px-2 py-1 rounded-full 
                            ${false ? "bg-green-100 text-green-800" :
                                        false ? "bg-yellow-100 text-yellow-800" :
                                            "bg-orange-100 text-orange-800"
                                    }`}>
                                    Unpaid
                                </span>
                            </div>

                            <div className="space-y-2">
                                {isAirportTransfer ? (
                                    <>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Base Fare</span>
                                            <span className="text-gray-900">
                                                {formatPrice(transfer?.baseFare!)}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Airport Toll</span>
                                            <span className="text-gray-900">
                                                {formatPrice(transfer?.airportToll!)}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">Total Fare</span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatPrice(transfer?.baseFare! + transfer?.airportToll!)}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Base Price</span>
                                            <span className="text-gray-900">
                                                {getPricePart(Number(booking.price), "base")}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">Tax (5%)</span>
                                            <span className="text-gray-900">
                                                {getPricePart(Number(booking.price), "tax")}
                                            </span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-2">
                                            <div className="flex items-center justify-between">
                                                <span className="font-medium text-gray-900">Total Amount</span>
                                                <span className="font-semibold text-gray-900">
                                                    {formatPrice(booking.price)}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Advance Paid</span>
                                    <span className="text-green-600">₹0</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">Balance Due</span>
                                    <span className="font-medium text-orange-600">
                                        {isAirportTransfer ?
                                            formatPrice(transfer?.baseFare! + transfer?.airportToll!)
                                            : formatPrice(booking.price)}
                                    </span>
                                </div>
                            </div>

                            {isAirportTransfer && (
                                <div className="border-t border-gray-200 pt-3 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <i className="ri-shield-check-line text-green-600 text-lg mt-0.5"></i>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Fixed fare, No hidden charges</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <i className="ri-calendar-close-line text-blue-600 text-lg mt-0.5"></i>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Cancel free until 4 hours prior; no refunds after</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {true && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-4">
                                    <div className="flex items-start gap-2">
                                        <i className="ri-information-line text-blue-600 text-sm mt-0.5"></i>
                                        <p className="text-sm text-blue-800">
                                            Please pay {
                                                isAirportTransfer ? formatPrice(transfer?.baseFare! + transfer?.airportToll!)
                                                    : formatPrice(booking.price)
                                            } in cash/UPI directly to your chauffeur at trip completion.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {!isAirportTransfer && (
                        <div className="bg-white rounded-xl border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-4">
                                <i className="ri-lightbulb-line text-yellow-600 text-lg"></i>
                                <h3 className="font-semibold text-gray-900">Know Before You Go</h3>
                            </div>

                            <div className="space-y-2">
                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleSection("essential")}
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <i className="ri-shopping-bag-line text-green-600"></i>
                                            <span className="font-medium text-gray-900">Essential Items</span>
                                        </div>
                                        <i className={`ri-arrow-${expandedSections.essential ? "up" : "down"}-s-line text-gray-500`}></i>
                                    </button>
                                    {expandedSections.essential && (
                                        <div className="px-3 pb-3 bg-gray-50">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-footprint-line text-green-600 text-xs"></i>
                                                    <span>Wear comfortable shoes for walking</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-id-card-line text-green-600 text-xs"></i>
                                                    <span>Carry a valid ID</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-sun-line text-green-600 text-xs"></i>
                                                    <span>Bring a hat and sunscreen to protect from the sun</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleSection("accessibility")}
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <i className="ri-wheelchair-line text-blue-600"></i>
                                            <span className="font-medium text-gray-900">Accessibility & Requirements</span>
                                        </div>
                                        <i className={`ri-arrow-${expandedSections.accessibility ? "up" : "down"}-s-line text-gray-500`}></i>
                                    </button>
                                    {expandedSections.accessibility && (
                                        <div className="px-3 pb-3 bg-gray-50">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-walk-line text-orange-600 text-xs"></i>
                                                    <span>Prepare to walk for 20 minutes</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-stairs-line text-red-600 text-xs"></i>
                                                    <span>Approximately 100 stairs to climb</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-close-circle-line text-red-600 text-xs"></i>
                                                    <span>Wheelchair not accessible</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleSection("rules")}
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <i className="ri-shield-check-line text-orange-600"></i>
                                            <span className="font-medium text-gray-900">Rules & Restrictions</span>
                                        </div>
                                        <i className={`ri-arrow-${expandedSections.rules ? "up" : "down"}-s-line text-gray-500`}></i>
                                    </button>
                                    {expandedSections.rules && (
                                        <div className="px-3 pb-3 bg-gray-50">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-camera-line text-green-600 text-xs"></i>
                                                    <span>A camera is allowed for capturing your memories</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-no-smoking-line text-red-600 text-xs"></i>
                                                    <span>Smoking and consumption of food and drinks are restricted in the vehicle</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-ticket-line text-blue-600 text-xs"></i>
                                                    <span>Entry tickets will cost around ₹500-600 per person, buy directly inside premise</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="border border-gray-200 rounded-lg overflow-hidden">
                                    <button
                                        onClick={() => toggleSection("weather")}
                                        className="w-full flex items-center justify-between p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center gap-2">
                                            <i className="ri-cloud-line text-purple-600"></i>
                                            <span className="font-medium text-gray-900">Weather Advisory</span>
                                        </div>
                                        <i className={`ri-arrow-${expandedSections.weather ? "up" : "down"}-s-line text-gray-500`}></i>
                                    </button>
                                    {expandedSections.weather && (
                                        <div className="px-3 pb-3 bg-gray-50">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-cloudy-line text-gray-600 text-xs"></i>
                                                    <span>Be prepared for varying weather conditions</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <i className="ri-umbrella-line text-blue-600 text-xs"></i>
                                                    <span>Carry an umbrella during monsoon season</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-medium text-sm hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <i className="ri-home-line"></i>
                            Back to Home
                        </button>
                        <button
                            onClick={() => navigate("/bookings")}
                            className="py-3 px-4 bg-gray-900 text-white rounded-xl font-medium text-sm hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <i className="ri-calendar-check-line"></i>
                            My Bookings
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="min-h-[100svh] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Booking Details Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested booking could not be found.</p>
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
}