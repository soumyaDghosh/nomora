import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { transferData } from "../data/transferData";
import useBookTransfer from "../hooks/useBookTransfer";

type FareData = {
    type: string;
    terminal: string;
    date: string;
    time: string;
    guests: string;
};

export default function TransferFare() {
    const { transferId } = useParams<{ transferId: string }>();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const { loading, bookTransfer } = useBookTransfer();

    const transfer = transferData[transferId ?? ""];

    const [fareData, setFareData] = useState<FareData | null>(null);

    useEffect(() => {
        const type = searchParams.get("type");
        const terminal = searchParams.get("terminal");
        const date = searchParams.get("date");
        const time = searchParams.get("time");
        const guests = searchParams.get("guests");

        if (type && terminal && date && time) {
            setFareData({
                type,
                terminal,
                date,
                time,
                guests: guests || "1"
            });
        }
    }, [searchParams]);

    const formatPrice = (amount: number) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace("₹", "₹");
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-IN", {
            month: "short",
            day: "2-digit"
        });
    };

    if (!transferId || !transfer || !fareData?.type || !fareData?.terminal || !fareData?.date || !fareData?.time || !fareData?.guests) {
        return (
            <div className="min-h-[100svh] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Transfer Not Found</h2>
                    <p className="text-gray-600 mb-4">The requested transfer could not be found.</p>
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

    const handleConfirmBooking = async () => {
        const { success, bookingId } = await bookTransfer({
            product_type: transfer.product_type,
            listing_id: transferId,
            price: transfer.baseFare + transfer.airportToll,
            transfer_details: {
                type: fareData.type === "pickup" ? "Pickup from Airport" : "Drop to Airport",
                from_location: fareData.type === "pickup" ? transfer.airport : transfer.hotel,
                to_location: fareData.type === "pickup" ? transfer.hotel : transfer.airport,
                terminal: fareData.terminal,
                date: fareData.date,
                time: fareData.time,
                guest_count: fareData.guests
            },
        });

        if (success) {
            navigate(`/confirmation/${bookingId}`);
        }
    };

    return (
        <div className="min-h-[100svh] bg-gray-50 pb-[calc(89px)]">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-4 py-3 pt-6 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center cursor-pointer">
                        <i className="ri-arrow-left-line text-xl text-gray-700" />
                    </button>
                    <h1 className="text-lg font-medium text-gray-900">
                        {fareData.type === "pickup" ? `Pickup from ${transfer.airport} Airport` : `Drop to ${transfer.airport} Airport`}
                    </h1>
                </div>
            </div>

            <div className="px-4 py-4 space-y-4">
                {/* Fare Breakdown with integrated trust & flexibility */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-money-rupee-circle-line text-lg text-green-600" />
                            <span className="font-medium text-gray-900">Fare Breakdown</span>
                        </div>
                    </div>
                    <div className="px-4 pt-4 pb-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Base Fare</span>
                            <span className="text-sm font-medium text-gray-900">{formatPrice(transfer.baseFare)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Airport Toll</span>
                            <span className="text-sm font-medium text-gray-900">{formatPrice(transfer.airportToll)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">Total Fare</span>
                                <span className="text-lg font-bold text-gray-900">{formatPrice(transfer.baseFare + transfer.airportToll)}</span>
                            </div>
                        </div>

                        {/* Trust & Flexibility integrated within Fare Breakdown */}
                        <div className="border-t border-gray-200 pt-3 space-y-3">
                            <div className="flex items-center gap-3">
                                <i className="ri-shield-check-line text-green-600 text-lg mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Fixed fare, No hidden charges</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <i className="ri-calendar-close-line text-blue-600 text-lg mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Cancel free until 4 hours prior; no refunds after</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trip Summary */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-file-list-3-line text-lg text-blue-600" />
                            <span className="font-medium text-gray-900">Trip Summary</span>
                        </div>
                    </div>
                    <div className="px-4 pt-4 pb-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Transfer Type</span>
                            <span className="text-sm font-medium text-gray-900">
                                {fareData.type === "pickup" ? "Pick-up from Airport" : "Drop to Airport"}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Terminal</span>
                            <span className="text-sm font-medium text-gray-900">{fareData.terminal}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Date & Time</span>
                            <span className="text-sm font-medium text-gray-900">
                                {formatDate(fareData.date)}, {fareData.time}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Guests</span>
                            <span className="text-sm font-medium text-gray-900">{fareData.guests}</span>
                        </div>
                    </div>
                </div>

                {/* NEW: Value Propositions Section */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-star-line text-lg text-yellow-600" />
                            <span className="font-medium text-gray-900">Why Nomora</span>
                        </div>
                    </div>
                    <div className="px-4 pt-4 pb-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i className="ri-time-line text-blue-600 text-sm" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">Early Car Assignment</h4>
                                    <p className="text-xs text-gray-600">Zero stress, no impact on plans</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i className="ri-user-line text-green-600 text-sm" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">Uniformed Driver</h4>
                                    <p className="text-xs text-gray-600">Professional & reliable</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i className="ri-hand-heart-line text-purple-600 text-sm" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">No Hassle</h4>
                                    <p className="text-xs text-gray-600">Fixed fare, no hidden charges</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <i className="ri-suitcase-line text-orange-600 text-sm" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">Luggage Help</h4>
                                    <p className="text-xs text-gray-600">Assistance with bags</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Vehicle Information - FIXED: New white sedan image */}
                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-car-line text-lg text-purple-600" />
                            <span className="font-medium text-gray-900">Vehicle Details</span>
                        </div>
                    </div>
                    <div className="px-4 pt-4 pb-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://static.readdy.ai/image/638a2981e869109b2bf5c39446e6f624/61dfcac27a8f463ebda3236e0a403120.png"
                                alt=""
                                className="w-15 h-11 object-contain rounded"
                                loading="lazy"
                            />
                            <div>
                                <h3 className="font-medium text-gray-900">AC Sedan</h3>
                                <p className="text-sm text-gray-600">4+1 Seats • Dzire, Etios, Xcent</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Information */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <i className="ri-money-rupee-circle-line text-green-600 text-lg mt-0.5" />
                        <div>
                            <h3 className="font-medium text-green-900 mb-1">Payment Method</h3>
                            <p className="text-sm text-green-800">Pay in Cash/UPI directly to your chauffeur after the trip</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fixed Bottom CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                <div className="max-w-md mx-auto">
                    {/* <button
                        onClick={handleConfirmBooking}
                        className="w-full bg-gray-900 text-white py-4 rounded-xl font-medium text-base hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                        Book Now • {formatPrice(transfer.baseFare + transfer.airportToll)}
                    </button> */}
                    <button
                        onClick={handleConfirmBooking}
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center ${!loading
                            ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                            }`}
                    >
                        {loading && (
                            <div className="w-5 h-5 border-2 border-white border-t-gray-800 rounded-full animate-spin mr-2" />
                        )}
                        Book Now • {formatPrice(transfer.baseFare + transfer.airportToll)}
                    </button>
                </div>
            </div>
        </div>
    )
}