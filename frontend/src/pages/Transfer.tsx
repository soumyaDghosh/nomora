import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import DateTimePicker from "../components/DateTimePicker";

export default function Transfer() {
    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const isDeeplink = params.get("type") === "deeplink";

    const { hotel } = useAuthStore();

    const [transferType, setTransferType] = useState<"pickup" | "drop">(
        isDeeplink && (params.get("transfer_type") === "pickup" || params.get("transfer_type") === "drop")
            ? (params.get("transfer_type") as "pickup" | "drop")
            : "drop"
    );
    const [selectedTerminal, setSelectedTerminal] = useState<"T1" | "T2" | "">("T1");
    const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
    const [guestCount, setGuestCount] = useState<number>(0);

    const isFormValid = useCallback(() => {
        return !!selectedDateTime;
    }, [selectedDateTime]);

    const handleDateTimeSelect = useCallback((date: Date) => {
        setSelectedDateTime(date);
    }, []);

    // FIXED: Smooth transition without pause after loading
    const handleCheckFare = async () => {
        if (!isFormValid()) return;

        const formattedDate = selectedDateTime!.toLocaleDateString("en-CA", {
            timeZone: "Asia/Kolkata",
        });

        let formattedTime = selectedDateTime!.toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            timeZone: "Asia/Kolkata",
        });
        formattedTime = formattedTime.toUpperCase();

        const transferParams = new URLSearchParams({
            type: transferType,
            terminal: selectedTerminal,
            date: formattedDate,
            time: formattedTime,
            guests: guestCount.toString(),
        });

        navigate(`/${hotel?.id}/transfer/fare?${transferParams.toString()}`);
    };

    return (
        <div className="min-h-[100svh] bg-gray-50 pb-[calc(81px)]">
            {/* Header */}
            <div className="bg-white px-4 py-4 mb-6 shadow-sm shadow-gray-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center">
                        <i className="ri-plane-line text-white text-lg" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">Airport Transfer</h1>
                        <p className="text-sm text-gray-600">Safe and hassle-free premium rides</p>
                    </div>
                </div>
            </div>

            <div className="px-4 space-y-4 mb-6">
                {/* Transfer Type */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-exchange-line text-lg text-purple-600" />
                            <span className="font-medium text-gray-900">Transfer Type</span>
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-1 gap-3">
                            <button
                                onClick={() => setTransferType("drop")}
                                className={`p-4 rounded-lg border text-left transition-colors cursor-pointer ${transferType === "drop"
                                    ? "border-gray-900 bg-gray-50"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <i className="ri-flight-takeoff-line text-green-600 text-lg" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Drop to Airport</h3>
                                            <p className="text-sm text-gray-600">Hotel → Airport</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 ${transferType === "drop" ? "border-gray-900 bg-gray-900" : "border-gray-300"
                                            }`}
                                    >
                                        {transferType === "drop" && (
                                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                        )}
                                    </div>
                                </div>
                            </button>

                            <button
                                onClick={() => setTransferType("pickup")}
                                className={`p-4 rounded-xl border text-left transition-colors cursor-pointer ${transferType === "pickup"
                                    ? "border-gray-900 bg-gray-50"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <i className="ri-flight-land-line text-blue-600 text-lg" />
                                        <div>
                                            <h3 className="font-medium text-gray-900">Pickup from Airport</h3>
                                            <p className="text-sm text-gray-600">Airport → Hotel</p>
                                        </div>
                                    </div>
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 ${transferType === "pickup" ? "border-gray-900 bg-gray-900" : "border-gray-300"
                                            }`}
                                    >
                                        {transferType === "pickup" && (
                                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                        )}
                                    </div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Locations */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-map-pin-line text-lg text-red-600" />
                            <span className="font-medium text-gray-900">Locations</span>
                        </div>
                    </div>
                    <div className="px-4 pb-4 space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center">
                                {transferType === "pickup" ? (
                                    <i className="ri-flight-land-line text-green-600 text-lg" />
                                ) : (
                                    <i className="ri-hotel-line text-green-600 text-lg" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-600">From</p>
                                <p className="font-medium text-gray-900 truncate leading-tight">
                                    {transferType === "pickup" ? "KIA (BLR)" : hotel?.display_name}
                                </p>
                            </div>
                            {transferType === "pickup" && (
                                <div className="flex bg-gray-100 rounded-lg p-1 ml-2">
                                    <button
                                        onClick={() => setSelectedTerminal("T1")}
                                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${selectedTerminal === "T1" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}
                                    >
                                        T1
                                    </button>
                                    <button
                                        onClick={() => setSelectedTerminal("T2")}
                                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${selectedTerminal === "T2" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}
                                    >
                                        T2
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3 pl-6">
                            <div className="w-0.5 h-6 bg-gray-300"></div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 flex items-center justify-center">
                                {transferType === "pickup" ? (
                                    <i className="ri-hotel-line text-green-600 text-lg" />
                                ) : (
                                    <i className="ri-flight-takeoff-line text-green-600 text-lg" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-600">To</p>
                                <p className="font-medium text-gray-900 truncate leading-tight">
                                    {transferType === "pickup" ? hotel?.display_name : "KIA (BLR)"}
                                </p>
                            </div>
                            {transferType === "drop" && (
                                <div className="flex bg-gray-100 rounded-lg p-1 ml-2">
                                    <button
                                        onClick={() => setSelectedTerminal("T1")}
                                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${selectedTerminal === "T1" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}
                                    >
                                        T1
                                    </button>
                                    <button
                                        onClick={() => setSelectedTerminal("T2")}
                                        className={`px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer ${selectedTerminal === "T2" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"}`}
                                    >
                                        T2
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Date & Time Selection */}
                <div className="bg-white rounded-xl border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-calendar-line text-lg text-orange-600" />
                            <div>
                                <span className="font-medium text-gray-900">Schedule</span>
                                <p className="text-sm text-gray-600">Book up to 4 hours in advance</p>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <DateTimePicker
                            onSelect={handleDateTimeSelect}
                            placeholder="Select date and time"
                            value={selectedDateTime}
                        />
                    </div>
                </div>

                {/* Guest Count */}
                <div className="bg-white rounded-xl border border-gray-200 mb-4">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-group-line text-lg text-cyan-600" />
                            <span className="font-medium text-gray-900">Guest Count</span>
                        </div>
                    </div>
                    <div className="px-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Number of guests</span>
                            <div className="flex items-center gap-3 pt-4">
                                <button
                                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                    disabled={guestCount <= 1}
                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="ri-subtract-line" />
                                </button>
                                <span className="text-lg font-medium text-gray-900 w-8 text-center">{guestCount}</span>
                                <button
                                    onClick={() => setGuestCount(Math.min(4, guestCount + 1))}
                                    disabled={guestCount >= 4}
                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="ri-add-line" />
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Maximum 4 guests allowed</p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-4 rounded-lg">
                    <div className="max-w-md mx-auto">
                        {!isFormValid() && (
                            <div className="mb-2 text-center">
                                <p className="text-xs text-gray-500">Select date and time</p>
                            </div>
                        )}
                        <div className="relative">
                            <div
                                className={`w-full py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center ${isFormValid()
                                    ? "bg-gray-900 text-white hover:bg-gray-800"
                                    : "bg-gray-300 text-gray-500"
                                    }`}
                            >
                                Check Fare
                            </div>
                            <button
                                id="checkFare"
                                disabled={!isFormValid()}
                                onClick={handleCheckFare}
                                className={`absolute inset-0 text-transparent cursor-pointer ${isFormValid()
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed"
                                    }`}
                            >
                                Transfer Check Fare ({hotel?.display_name})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}