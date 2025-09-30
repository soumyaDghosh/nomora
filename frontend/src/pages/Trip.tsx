import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import ImageCarousel from "../components/ImageCarousel";
import { tripData } from "../data/tripData";
import { badgesData } from "../data/badgesData";
import { inclusionsData } from "../data/inclusionsData";
import { whyNomoraData } from "../data/nomoraData";
import { formatPrice } from "../utils/formatPrice";

export default function Trip() {
    const { tripId } = useParams<{ tripId: string }>();
    const navigate = useNavigate();

    const { hotel } = useAuthStore();

    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [showImageHint, setShowImageHint] = useState(false);

    // Show image hint animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowImageHint(true);
            // Hide after 3 seconds
            setTimeout(() => setShowImageHint(false), 3000);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const toggleTooltip = (id: string) => {
        setActiveTooltip(activeTooltip === id ? null : id);
    };

    // Close tooltip when clicking outside
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

    // Safe text helper for adaptive data handling
    const safeText = (text: string | undefined | null, fallback: string = "") => {
        return text && text.trim() ? text : fallback;
    };

    // Format date for India
    // const formatDate = (date: Date) => {
    //     return date.toLocaleDateString("en-IN", {
    //         weekday: "short",
    //         day: "numeric",
    //         month: "short",
    //         year: "numeric"
    //     });
    // };

    const trip = tripData[tripId ?? ""];

    if (!tripId || !trip) {
        return (
            <div className="min-h-[100svh] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Trip Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested trip could not be found.</p>
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

    return (
        <div className="min-h-[100svh] bg-white pb-[calc(93px)]">
            {/* Header - Match Dashboard spacing */}
            <div className="bg-white px-4 py-4.5 shadow-sm shadow-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="w-10 h-10 flex items-center justify-center cursor-pointer"
                        >
                            <i className="ri-arrow-left-line text-xl text-gray-700" />
                        </button>
                        <h1 className="text-lg font-medium text-gray-900 truncate flex-1">
                            {safeText(trip.product_type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()), "Heritage City Tour")}
                        </h1>
                    </div>
                    <button
                        onClick={() => navigate(`/${hotel?.id}/support`)}
                        className="flex items-center gap-2 bg-white hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        <i className="ri-headphone-line text-xl text-gray-700" />
                        <span className="text-xs font-medium text-gray-600">24/7</span>
                    </button>
                </div>
            </div>

            {/* Enhanced Image Carousel with Hint Animation */}
            <div className="px-4 pt-6 pb-4 relative">
                <ImageCarousel images={trip.images} />

                {/* Image Tap Hint Animation */}
                {showImageHint && (
                    <div className="absolute inset-0 pointer-events-none z-30">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium animate-bounce">
                            <div className="flex items-center gap-2">
                                <span>Tap to explore</span>
                            </div>
                        </div>

                        {/* Ripple effect */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="w-20 h-20 border-2 border-white/50 rounded-full animate-ping"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/30 rounded-full animate-ping animation-delay-150"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tags with auto-layout */}
            {trip.tags && trip.tags.length > 0 && (
                <div className="px-4 mb-4">
                    <div className="flex flex-wrap gap-2">
                        {trip.tags.map((tag, index) => (
                            <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-xs font-medium break-words ${tag.color === "orange" ? "bg-orange-500 text-white" : "bg-red-500 text-white"}`}
                            >
                                {safeText(tag.text, "Tag")}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Title and Description */}
            <div className="px-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 leading-tight break-words">
                    {safeText(trip.title, "City Tour Experience")}
                </h2>
                {trip.description && (
                    <p className="text-gray-600 text-sm leading-relaxed break-words">
                        {trip.description}
                    </p>
                )}
            </div>

            {/* Enhanced Badges with Tooltips - Redesigned 2-Column Grid Layout */}
            <div className="px-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                    {badgesData.map((badge, index) => (
                        <div key={index} className="relative" ref={activeTooltip === `badge-${index}` ? tooltipRef : null}>
                            <div className="flex flex-col p-4 bg-gray-50 rounded-lg h-full">
                                {/* Icon and Info Button Row */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm flex-shrink-0">
                                        <i className={`${badge.icon} text-${badge.color}-600 text-xl`} />
                                    </div>
                                    {badge.tooltip && (
                                        <button
                                            onClick={() => toggleTooltip(`badge-${index}`)}
                                            className="w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 flex-shrink-0 bg-white rounded-full shadow-sm cursor-pointer"
                                        >
                                            <i className="ri-information-line text-sm" />
                                        </button>
                                    )}
                                </div>

                                {/* Feature Text */}
                                <div className="flex-1">
                                    <span className="text-sm text-gray-700 font-medium leading-snug">
                                        {safeText(badge.text, "Feature")}
                                    </span>
                                </div>
                            </div>

                            {/* Enhanced Tooltip with close button and outside click */}
                            {activeTooltip === `badge-${index}` && badge.tooltip && (
                                <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg z-20">
                                    <div className="absolute -top-1 left-4 w-2 h-2 bg-gray-900 rotate-45"></div>
                                    <div className="flex items-start gap-2">
                                        <span className="flex-1 break-words leading-relaxed">{badge.tooltip}</span>
                                        <button
                                            onClick={() => setActiveTooltip(null)}
                                            className="w-4 h-4 flex items-center justify-center text-gray-300 hover:text-white flex-shrink-0 cursor-pointer"
                                        >
                                            <i className="ri-close-line text-xs" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Enhanced Quick Info with increased spacing */}
            <div className="px-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="ri-information-line" />
                        Quick Info
                    </h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg flex-shrink-0">
                                <i className="ri-time-line text-blue-600 text-lg" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="text-sm font-medium break-words">
                                    {safeText(trip.duration, "Full Day")}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-lg flex-shrink-0">
                                <i className="ri-group-line text-green-600 text-lg" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Capacity</p>
                                <p className="text-sm font-medium break-words">1-6 Guests</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-lg flex-shrink-0">
                                <i className="ri-car-line text-purple-600 text-lg" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Type</p>
                                <p className="text-sm font-medium break-words">
                                    Private Vehicle
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-lg flex-shrink-0">
                                <i className="ri-map-pin-2-line text-orange-600 text-lg" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Pickup & Drop</p>
                                <p className="text-sm font-medium break-words">Included</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center bg-orange-100 rounded-lg flex-shrink-0">
                                 {/* <i className="ri-contrast-drop-line w-3 h-6 text-gray-600" ri-thermometer-line/> */}
                                <i className="ri-temp-cold-line w-4 h-4 flex items-center justify-center text-yellow-400" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-500">Air-Conditioned</p>
                                <p className="text-sm font-medium break-words">AC Type</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced Detailed Itinerary with auto-layout */}
            {trip.itinerary && trip.itinerary.length > 0 && (
                <div className="px-4 mb-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="ri-route-line" />
                        Detailed Itinerary
                    </h3>
                    <div className="space-y-4">
                        {trip.itinerary.map((item, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex flex-col items-center flex-shrink-0">
                                    {(index === 0 || trip.itinerary.length === index + 1) ? (
                                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mb-2">
                                            <span className="text-white text-xs font-bold">
                                                {index === 0 ? "S" : "E"}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mb-2">
                                            <span className="text-white text-sm font-bold">{index}</span>
                                        </div>
                                    )}
                                    {index < trip.itinerary.length - 1 && (
                                        <div className="w-0.5 h-8 bg-gray-200 flex-shrink-0"></div>
                                    )}
                                </div>
                                <div className="flex-1 pb-4 min-w-0">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-gray-900 mb-1 break-words">
                                                {safeText(item.time, "Time TBA")}
                                            </p>
                                            <h4 className="font-semibold text-gray-900 mb-1 break-words">
                                                {safeText(item.title, "Location")}
                                            </h4>
                                            {item.description && (
                                                <p className="text-gray-600 text-sm leading-relaxed break-words">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                        {item.duration && (
                                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded flex-shrink-0 break-words">
                                                {item.duration}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Enhanced What"s Included & Excluded - Fixed Background Color and Margins */}
            <div className="px-4 mb-6">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <i className="ri-list-check" />
                        What"s Included & Excluded
                    </h3>
                    <div className="space-y-4">
                        {/* Included */}
                        <div>
                            <h4 className="font-medium text-green-700 mb-3 flex items-center gap-2">
                                <i className="ri-checkbox-circle-line" />
                                Included
                            </h4>
                            <div className="space-y-2">
                                {inclusionsData.included.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-lg flex-shrink-0">
                                            <i className={`${item.icon} text-green-600 text-sm`} />
                                        </div>
                                        <span className="text-sm text-gray-700 break-words flex-1">
                                            {safeText(item.text, "Service included")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Not Included */}
                        <div>
                            <h4 className="font-medium text-red-700 mb-3 flex items-center gap-2">
                                <i className="ri-close-circle-line" />
                                Not Included
                            </h4>
                            <div className="space-y-2">
                                {inclusionsData.notIncluded.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="w-6 h-6 flex items-center justify-center bg-red-100 rounded-lg flex-shrink-0">
                                            <i className={`${item.icon} text-red-600 text-sm`} />
                                        </div>
                                        <span className="text-sm text-gray-700 break-words flex-1">
                                            {safeText(item.text, "Service not included")}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Nomora */}
            <div className="px-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <i className="ri-star-line" />
                    Why Nomora
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    {whyNomoraData.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                                <i className={`${item.icon} text-blue-600 text-sm`} />
                            </div>
                            <span className="text-xs text-gray-700 font-medium break-words flex-1">
                                {safeText(item.text, "Service feature")}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Fixed Bottom Price and CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4">
                <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1 mr-4">
                        <p className="text-xs text-gray-500">Starting from</p>
                        <p className="text-xl font-bold text-gray-900 break-words">
                            {formatPrice(trip.price || 0)}
                        </p>
                        <p className="text-xs text-gray-500 break-words">Price varies by car type</p>
                    </div>
                    <div className="relative w-fit">
                        <div className="bg-gray-900 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 flex-shrink-0 hover:bg-gray-800 transition-colors">
                            <i className="ri-time-line" />
                            <span className="whitespace-nowrap">Select Timeslot</span>
                        </div>
                        <button
                            id="selectTimeslot"
                            onClick={() => navigate(`/${hotel?.id}/checkout/${tripId}`)}
                            className="absolute inset-0 text-transparent cursor-pointer"
                        >
                            Trip Select Timeslot ({trip.title}, {hotel?.display_name})
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}