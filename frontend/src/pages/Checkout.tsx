import { useState, useCallback, useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useBookTour from "../hooks/useBookTour";
import useAuthStore from "../store/authStore";
import { tripData, type CarType, type TimeSlot } from "../data/tripData";
import { formatPrice } from "../utils/formatPrice";
import { toast } from "sonner";

type EnhancedTimeSlot = TimeSlot & {
    isBookable: boolean;
}

interface DateOption {
    dateString: string;
    dayName: string;
    dayNumber: number;
    monthName: string;
    isToday: boolean;
    fullDate: Date;
    isBookable: boolean;
}

export default function Checkout() {
    const { tripId } = useParams<{ tripId: string }>();
    const navigate = useNavigate();

    const { loading, bookTour } = useBookTour();

    const { hotel } = useAuthStore();

    const [selectedAcType, setSelectedAcType] = useState<"AC" | "Non-AC">("AC");
    // const [seatingCapacity, setSeatingCapacity] = useState<number>(0);
    const [guestCount, setGuestCount] = useState<number>(0);
    const [selectedCarType, setSelectedCarType] = useState<CarType["id"] | "">("");
    const [selectedDate, setSelectedDate] = useState<string>("");
    const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
    const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
    const [customDateValue, setCustomDateValue] = useState<string>("");
    const [expandedSections, setExpandedSections] = useState({
        pricingCharges: true,
        tripTerms: true,
    });

    const trip = tripData[tripId!];

    const generateCalendarDates = useCallback((): DateOption[] => {
        const dates = [];
        const today = new Date();

        for (let i = 0; i < 8; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);

            const dayName = date.toLocaleDateString("en-IN", { weekday: "short" });
            const dayNumber = date.getDate();
            const monthName = date.toLocaleDateString("en-IN", { month: "short" });
            const isToday = i === 0;
            const dateString = date.toISOString().split("T")[0];

            const isBookable = i <= 7;

            dates.push({
                dateString,
                dayName: isToday ? "Today" : dayName,
                dayNumber,
                monthName,
                isToday,
                fullDate: date,
                isBookable,
            });
        }

        return dates;
    }, []);

    // Parse YYYY-MM-DD safely into local date (midnight IST)
    const parseLocalDate = (dateString: string): Date => {
        const [year, month, day] = dateString.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    // Function to get current IST time
    const getCurrentISTTime = useCallback(() => {
        // Create IST time
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
        const istTime = new Date(utc + istOffset);

        return istTime;
    }, []);

    // NEW LOGIC
    // FIXED: Updated time slot booking logic to properly handle T+7 date with IST time
    const isTimeSlotBookable = useCallback((dateString: string, timeSlot: string): boolean => {
        if (!dateString || !timeSlot) return false;

        const selectedDate = parseLocalDate(dateString);

        const [time, period] = timeSlot.split(" ");
        const [h, m] = time.split(":").map(Number);
        let hours = h;
        const minutes = m || 0;

        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        selectedDate.setHours(hours, minutes, 0, 0);

        const nowIST = getCurrentISTTime();

        // Normalize dates to midnight for day comparison
        const todayStart = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());
        const selectedDateStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
        const daysDiff = Math.floor((selectedDateStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

        // Outside booking window (T-1 or >T+7)
        if (daysDiff <=0 || daysDiff > 7) return false;

        // Enforce 8-hour lead time for ALL bookings
        const hoursDiff = (selectedDate.getTime() - nowIST.getTime()) / (1000 * 60 * 60);

        //                       this logic ensure that if the time is more than 8 we can select from t+2 day and if it nearly to 8 it allows upto 8:05 PM
        return hoursDiff >= 8 && ((new Date().getHours()<20 || (new Date().getHours()==20 && new Date().getMinutes()<=5)) || daysDiff>1);
    }, [getCurrentISTTime]);

    const calculateTotal = useCallback(() => {
        if (!selectedCarType || !trip) return 0;

        const carType = trip.carTypes.find((car: CarType) => car.id === selectedCarType);
        if (!carType) return 0;

        const basePrice = selectedAcType === "AC" ? carType.acPrice : carType.nonAcPrice;
        const tax = basePrice * trip.taxRate;

        return basePrice + tax;
    }, [selectedCarType, selectedAcType, trip]);

    const isCheckoutReady = useCallback(() => {
        if (!selectedCarType || !selectedDate || !selectedTimeSlot || !trip) return false;

        const slot = trip.timeSlots.find((s: TimeSlot) => s.time === selectedTimeSlot);
        if (!slot || !slot.available) return false;

        return isTimeSlotBookable(selectedDate, selectedTimeSlot);
    }, [selectedCarType, selectedDate, selectedTimeSlot, trip, isTimeSlotBookable]);

    const toggleSection = useCallback((section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    }, []);

    const formatDateToDDMMYYYY = useCallback((dateString: string) => {
        if (!dateString) return "";

        const date = parseLocalDate(dateString);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }, []);

    // FIXED: Updated custom date selection logic to properly handle T+7 date with IST
    const handleCustomDateSelect = useCallback((dateValue: string) => {
        if (!dateValue) return;

        const selectedDateObj = parseLocalDate(dateValue);
        const nowIST = getCurrentISTTime();
        const today = new Date(nowIST.getFullYear(), nowIST.getMonth(), nowIST.getDate());
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 7);

        // FIXED: Use <= instead of < for maxDate comparison to include T+7 date
        if (selectedDateObj >= today && selectedDateObj <= maxDate) {
            setSelectedDate(dateValue);
            setCustomDateValue(dateValue);
            setSelectedTimeSlot("");
        }
    }, [getCurrentISTTime]);

    const handleCustomDatePickerToggle = useCallback(() => {
        setShowCustomDatePicker(!showCustomDatePicker);
        if (!showCustomDatePicker) {
            setSelectedDate("");
            setSelectedTimeSlot("");
            setCustomDateValue("");
        }
    }, [showCustomDatePicker]);

    const handleDirectDateSelect = useCallback((dateString: string) => {
        setSelectedDate(dateString);
        setSelectedTimeSlot("");
        setCustomDateValue("");
        setShowCustomDatePicker(false);
    }, []);

    // FIXED: Added handler for date input field clicks
    const handleDateInputClick = useCallback(() => {
        const dateInput = document.getElementById("date-input") as HTMLInputElement | null;
        if (dateInput) {
            if (dateInput.showPicker) {
                dateInput.showPicker();
            } else {
                dateInput.focus();
            }
        }
    }, []);

    const calendarDates = useMemo(() => generateCalendarDates(), [generateCalendarDates]);

    const selectedCarTypeData = useMemo(() => trip?.carTypes.find((car: CarType) => car.id === selectedCarType), [trip, selectedCarType]);

    const { basePrice, tax, total } = useMemo(() => {
        const base = selectedCarTypeData
            ? (selectedAcType === "AC"
                ? selectedCarTypeData.acPrice
                : selectedCarTypeData.nonAcPrice)
            : 0;

        const taxAmount = base * (trip?.taxRate || 0);
        const totalAmount = calculateTotal();
        // const advance = totalAmount * 0.25;

        return {
            basePrice: base,
            tax: taxAmount,
            total: totalAmount,
            // advanceAmount: advance,
        };
    }, [selectedCarTypeData, selectedAcType, trip, calculateTotal]);

    const enhancedTimeSlots: EnhancedTimeSlot[] = useMemo(() => {
        if (!trip) return [];

        return trip.timeSlots.map((slot: TimeSlot) => ({
            ...slot,   isBookable: slot.available && (selectedDate ? isTimeSlotBookable(selectedDate, slot.time) : false),
        }));
    }, [trip, selectedDate, isTimeSlotBookable]);

    const formatSelectedDate = useCallback((dateString: string) => {
        if (!dateString) return "";

        const date = parseLocalDate(dateString);
        const nowIST = getCurrentISTTime();
        const isToday = date.toDateString() === nowIST.toDateString();

        const tomorrow = new Date(nowIST);
        tomorrow.setDate(nowIST.getDate() + 1);
        const isTomorrow = date.toDateString() === tomorrow.toDateString();

        if (isToday) return "Today";
        if (isTomorrow) return "Tomorrow";

        return date.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
    }, [getCurrentISTTime]);

    // Get min and max dates for date input (only on client side) using IST
    const getDateLimits = useCallback(() => {
        const nowIST = getCurrentISTTime();
        const maxDate = new Date(nowIST);
        maxDate.setDate(nowIST.getDate() + 7);

        return {
            min: nowIST.toISOString().split("T")[0],
            max: maxDate.toISOString().split("T")[0],
        };
    }, [getCurrentISTTime]);

    const { min: minDate, max: maxDate } = getDateLimits();


    const handleConfirmBooking = async () => {
        if (!isCheckoutReady()) return;

        if (guestCount > Number(selectedCarTypeData?.seats?.[0])) {
            toast.error("Guest count cannot be more than the seating capacity of the selected vehicle category");
            return false;
        }

        const { success, bookingId } = await bookTour({
            product_type: trip.product_type,
            ac_type: selectedAcType,
            car_type: trip.carTypes.filter(type => type.id === selectedCarType)[0].name,
            date: selectedDate,
            time: selectedTimeSlot,
            price: total,
            listing_id: tripId!,
        });

        if (success) {
            navigate(`/${hotel?.id}/confirmation/${bookingId}`, { replace: true });
        }
    };

    if (!trip) {
        return (
            <div className="min-h-[100svh] bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Trip Not Found</h2>
                    <button onClick={() => navigate(-1)} className="bg-gray-800 text-white px-4 py-2 rounded-xl cursor-pointer">
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-[100svh] bg-gray-50 ${!isCheckoutReady() ? 'mb-[calc(113px)]' : 'mb-[calc(89px)]'}`}>
            {/* Header - Match Dashboard spacing */}
            <div className="bg-white px-4 py-4.5 sticky top-0 z-40 shadow-sm shadow-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center cursor-pointer">
                            <i className="ri-arrow-left-line text-xl text-gray-700" />
                        </button>
                        <h1 className="text-lg font-medium text-gray-900">Select Car & Schedule</h1>
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

            <div className="px-4 py-6 flex flex-col gap-4">
                {/* <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-temp-cold-line text-lg text-blue-600" />
                            <span className="font-medium text-gray-900">Select AC Preference</span>
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="flex gap-2">
                            <button
                                onClick={() => setSelectedAcType("AC")}
                                className={`flex-1 py-3 px-4 rounded-lg border font-medium text-sm transition-colors cursor-pointer ${selectedAcType === "AC"
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                AC
                            </button>
                            <button
                                onClick={() => setSelectedAcType("Non-AC")}
                                className={`flex-1 py-3 px-4 rounded-lg border font-medium text-sm transition-colors cursor-pointer ${selectedAcType === "Non-AC"
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                    }`}
                            >
                                Non-AC
                            </button>
                        </div>
                    </div>
                </div> */}

                {/*  */}
                <div className="bg-white rounded-xl border border-gray-200 mb-4">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-group-line text-lg text-cyan-600" />
                            <span className="font-medium text-gray-900">Guest Count</span>
                        </div>
                    </div>
                    <div className="px-4 py-2">
                        <div className="flex items-center justify-between">
                            <span className="text-md text-gray-600">Number of guests</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                                    disabled={guestCount <= 1}
                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="ri-subtract-line" />
                                </button>
                                <span className="text-lg font-medium text-gray-900 w-8 text-center">{guestCount}</span>
                                <button
                                    onClick={() => setGuestCount(Math.min(6, guestCount + 1))}
                                    disabled={guestCount >= 6}
                                    className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <i className="ri-add-line" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-car-line text-lg text-green-600" />
                            <span className="font-medium text-gray-900">Select Car Type</span>
                        </div>
                    </div>
                    <div className="px-4 pb-4 space-y-3">
                        {trip.carTypes.map((carType: CarType) => (
                            <div
                                key={carType.id}
                                className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${selectedCarType === carType.id
                                    ? "border-gray-900 bg-gray-50"
                                    : "border-gray-200 hover:border-gray-300"
                                    }`}
                                onClick={() => setSelectedCarType(carType.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <img
                                        src={carType.image}
                                        alt=""
                                        className="w-12 h-9 object-contain rounded"
                                        loading="lazy"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = "none";
                                            target.parentElement!.innerHTML = '<div class="w-12 h-9 bg-gray-100 rounded flex items-center justify-center"><i class="ri-car-line text-gray-400" /></div>';
                                        }}
                                    />
                                    <div>
                                        <h3 className="font-medium text-gray-900">{carType.name}</h3>
                                        <p className="text-xs text-gray-500">{carType.seats}</p>
                                        <p className="text-xs text-gray-500">{carType.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                        {formatPrice(selectedAcType === "AC" ? carType.acPrice : carType.nonAcPrice)}
                                    </p>
                                    <div
                                        className={`w-5 h-5 rounded-full border-2 mt-1 ${selectedCarType === carType.id
                                            ? "border-gray-900 bg-gray-900"
                                            : "border-gray-300"
                                            }`}
                                    >
                                        {selectedCarType === carType.id && (
                                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-calendar-line text-lg text-purple-600" />
                            <span className="font-medium text-gray-900">Select Date</span>
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-4 gap-2">
                            {calendarDates.slice(0, 3).map((date) => (
                                <button
                                    key={date.dateString}
                                    onClick={() => {
                                        if (date.isBookable) {
                                            handleDirectDateSelect(date.dateString);
                                        }
                                    }}
                                    disabled={!date.isBookable}
                                    className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${selectedDate === date.dateString
                                        ? "border-gray-900 bg-gray-50"
                                        : date.isBookable
                                            ? "border-gray-200 hover:border-gray-300"
                                            : "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
                                        }`}
                                >
                                    <div className="text-xs text-gray-500 mb-1">{date.dayName}</div>
                                    <div className="text-sm font-medium text-gray-900">{date.monthName} {date.dayNumber}</div>
                                    {date.isToday && (
                                        <div className="text-xs text-green-600 font-medium mt-1">Today</div>
                                    )}
                                </button>
                            ))}
                            <button
                                onClick={handleCustomDatePickerToggle}
                                className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 text-center cursor-pointer"
                            >
                                <div className="text-xs text-gray-500 mb-1">Custom</div>
                                <div className="text-sm font-medium text-gray-900">Pick Date</div>
                            </button>
                        </div>

                        {showCustomDatePicker && (
                            <div className="mt-3">
                                {/* FIXED: Made entire date input area clickable */}
                                <div
                                    onClick={handleDateInputClick}
                                    className="relative cursor-pointer w-full p-3 border border-gray-200 rounded-lg text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-gray-300 focus-within:border-gray-300 bg-white text-gray-900 font-medium"
                                >
                                    <input
                                        id="date-input"
                                        type="date"
                                        value={customDateValue}
                                        min={minDate}
                                        max={maxDate}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            setCustomDateValue(value);
                                            if (value) {
                                                handleCustomDateSelect(value);
                                            }
                                        }}
                                        className="w-full bg-transparent outline-none cursor-pointer"
                                        placeholder="DD/MM/2025"
                                    />
                                </div>
                                <p className="text-xs text-blue-600 mt-2 font-medium">
                                    Select date within next 7 days (DD/MM/YYYY)
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-time-line text-lg text-orange-600" />
                            <span className="font-medium text-gray-900">Select Time Slot</span>
                        </div>
                    </div>
                    <div className="px-4 pb-4">
                        <div className="grid grid-cols-3 gap-2">
                            {enhancedTimeSlots.map((slot) => (
                                <button
                                    key={slot.time}
                                    onClick={() => {
                                        if (slot.isBookable && selectedDate) {
                                            setSelectedTimeSlot(slot.time);
                                        }
                                    }}
                                    disabled={!slot.isBookable || !selectedDate}
                                    className={`p-3 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${selectedTimeSlot === slot.time
                                        ? "border-gray-900 bg-gray-50 text-gray-900"
                                        : slot.isBookable && selectedDate
                                            ? "border-gray-200 hover:border-gray-300 text-gray-900"
                                            : "border-gray-200 text-gray-400 cursor-not-allowed"
                                        }`}
                                >
                                    {slot.time}
                                    {!selectedDate ? (
                                        <div className="text-xs text-gray-400 mt-1">Select date first</div>
                                    ) : !slot.isBookable && slot.available ? (
                                        <div className="text-xs text-red-400 mt-1">Too soon</div>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <i className="ri-money-rupee-circle-line text-lg text-indigo-600" />
                            <span className="font-medium text-gray-900">Price Breakdown</span>
                        </div>
                    </div>
                    <div className="px-4 pb-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Base Price</span>
                            <span className="text-sm font-medium text-gray-900">{formatPrice(basePrice)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Tax (5%)</span>
                            <span className="text-sm font-medium text-gray-900">{formatPrice(tax)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-3">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-gray-900">Total</span>
                                <span className="text-lg font-bold text-gray-900">{formatPrice(total)}</span>
                            </div>
                            {/* <div className="mt-1.5 flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-900">Advance (25%)</span>
                                <span className="font-bold text-gray-900">{formatPrice(advanceAmount)}</span>
                            </div> */}
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 text-green-800 text-sm">
                                <i className="ri-shield-check-line" />
                                <span className="font-medium">No hidden charges</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    <button
                        onClick={() => toggleSection("pricingCharges")}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <i className="ri-information-line text-lg text-emerald-600" />
                            <span className="font-medium text-gray-900">Pricing and Charges</span>
                        </div>
                        {expandedSections.pricingCharges ? <i className="ri-arrow-up-s-line text-gray-500" /> : <i className="ri-arrow-down-s-line text-gray-500" />}
                    </button>

                    {expandedSections.pricingCharges && (
                        <div className="px-4 pb-4 space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                                <i className="ri-price-tag-3-line text-emerald-600 mt-0.5 flex-shrink-0" />
                                <span>Price includes reaching pickup and back to the garage</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="ri-money-rupee-circle-line text-orange-600 mt-0.5 flex-shrink-0" />
                                <span>Extra fees apply for overtime (₹500/hr includes 10 km), distance beyond 80 km (₹17/km), new routes</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="ri-timer-line text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>Billing is 30-min blocks (20 extra mins = 30 min billing)</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg border border-gray-200">
                    <button
                        onClick={() => toggleSection("tripTerms")}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <i className="ri-file-text-line text-lg text-red-600" />
                            <span className="font-medium text-gray-900">Trip Terms</span>
                        </div>
                        {expandedSections.tripTerms ? <i className="ri-arrow-up-s-line text-gray-500" /> : <i className="ri-arrow-down-s-line text-gray-500" />}
                    </button>

                    {expandedSections.tripTerms && (
                        <div className="px-4 pb-4 space-y-3 text-sm text-gray-600">
                            <div className="flex items-start gap-2">
                                <i className="ti-time-fill text-blue-600 mt-0.5 flex-shrink-0" />
                                <span>12-hour window = scheduled pickup to drop time</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="ri-user-settings-line text-gray-600 mt-0.5 flex-shrink-0" />
                                <span>Driver waits in car at stops (not a tour guide)</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="ri-alarm-warning-line text-orange-600 mt-0.5 flex-shrink-0" />
                                <span>Stay punctual - delays count toward 12 hours</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="ri-shield-check-line text-green-600 mt-0.5 flex-shrink-0" />
                                <span>Full refund or reschedule for unforeseen cancellations before trip starts like weather</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="ri-close-circle-line text-purple-600 mt-0.5 flex-shrink-0" />
                                <span>Once trip starts, refunds not applicable for any reason like traffic/weather delays</span>
                            </div>
                            <div className="flex items-start gap-2">
                                <i className="ri-calendar-close-line text-red-600 mt-0.5 flex-shrink-0" />
                                <span>No refunds for cancellation within 12 hrs</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                        <i className="ri-money-rupee-circle-line text-blue-600 text-lg mt-0.5" />
                        <div>
                            <h3 className="font-medium text-blue-900 mb-1">Payment Method</h3>
                            <p className="text-sm text-blue-800">Pay in Cash/UPI directly to your chauffeur on trip completion</p>
                        </div>
                    </div>
                </div> */}

                {/* Your Selection - Now includes seating capacity */}
                {(selectedDate || selectedTimeSlot || selectedCarType) && (
                    <div className="bg-blue-50 border-2 border-blue-200 px-4 py-3 rounded-lg shadow-sm">
                        <div className="flex items-center gap-3">
                            <i className="ri-calendar-check-line text-blue-600 text-lg" />
                            <div>
                                <h3 className="font-medium text-blue-900 mb-1">Your Selection</h3>
                                <div className="text-sm text-blue-800 space-y-1">
                                    {selectedDate && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Date:</span>
                                            <span>{formatSelectedDate(selectedDate)} ({formatDateToDDMMYYYY(selectedDate)})</span>
                                        </div>
                                    )}
                                    {selectedTimeSlot && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Time:</span>
                                            <span>{selectedTimeSlot}</span>
                                        </div>
                                    )}
                                    {selectedCarType && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Car:</span>
                                            <span>{selectedCarTypeData?.name} ({selectedAcType}) - {selectedCarTypeData?.seats}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
                    <div className="max-w-md mx-auto">
                        {!isCheckoutReady() && (
                            <div className="mb-2 text-center">
                                <p className="text-xs text-gray-500">
                                    {!selectedCarType && "Select car type"}
                                    {!selectedCarType && (!selectedDate || !selectedTimeSlot) && " • "}
                                    {!selectedDate && "Select date"}
                                    {!selectedDate && !selectedTimeSlot && " • "}
                                    {!selectedTimeSlot && "Select time slot"}
                                    {selectedDate && selectedTimeSlot && !isTimeSlotBookable(selectedDate, selectedTimeSlot) && "Selected slot unavailable - must be 8+ hours ahead"}
                                </p>
                            </div>
                        )}
                        <div className="relative w-full">
                            <div
                                className={`w-full py-4 rounded-xl font-medium text-base transition-all flex items-center justify-center ${(isCheckoutReady() && !loading)
                                    ? "bg-gray-900 text-white hover:bg-gray-800"
                                    : "bg-gray-300 text-gray-500"
                                    }`}
                            >
                                {loading && (
                                    <div className="w-5 h-5 border-2 border-white border-t-gray-800 rounded-full animate-spin mr-2" />
                                )}
                                Pay Now • {total > 0 ? formatPrice(total) : ""}
                            </div>
                            {/* Suspicious Button */}
                            <button
                                id="confirmBooking"
                                onClick={handleConfirmBooking}
                                disabled={!isCheckoutReady() || loading}
                                className={`absolute inset-0 text-transparent ${(isCheckoutReady() && !loading)
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed"
                                    }`}
                            >
                                Trip Confirm Booking ({trip.title}, {hotel?.display_name})
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}