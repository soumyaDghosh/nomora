import { useState, useEffect, useRef, useCallback } from "react";

interface DateTimePickerProps {
    onSelect: (date: Date) => void;
    placeholder?: string;
    disabled?: boolean;
    value?: Date | null;
}

interface DateOption {
    date: Date;
    label: string;
    isToday: boolean;
    isTomorrow: boolean;
}

const DateTimePicker = ({
    onSelect,
    placeholder = "Pick-up",
    disabled = false,
    value = null
}: DateTimePickerProps) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(value);
    const [selectedHours, setSelectedHours] = useState<number>(12);
    const [selectedMinutes, setSelectedMinutes] = useState<number>(0);
    const [showCalendar, setShowCalendar] = useState(false);
    const [validationError, setValidationError] = useState<string>("");
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const modalRef = useRef<HTMLDivElement>(null);
    const hoursScrollRef = useRef<HTMLDivElement>(null);
    const minutesScrollRef = useRef<HTMLDivElement>(null);

    // Get current IST time
    const getCurrentISTTime = useCallback(() => {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
        const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
        const istTime = new Date(utc + istOffset);
        return istTime;
    }, []);

    // FIXED: Enhanced centerSelectedTime function to center values when modal opens
    const centerSelectedTime = useCallback(() => {
        // Center hours scroller to show selected hour
        if (hoursScrollRef.current) {
            const container = hoursScrollRef.current;
            const containerHeight = container.clientHeight;
            const itemHeight = 40; // Height of each time item (h-10)
            const visibleItems = Math.floor(containerHeight / itemHeight);
            const centerOffset = Math.floor(visibleItems / 2);

            // Find all instances of the selected hour
            const targetHour = selectedHours;
            const totalSets = 5;
            const itemsPerSet = 24;

            // Calculate current scroll position in terms of item index
            const currentScrollTop = container.scrollTop;
            const currentItemIndex = Math.round(currentScrollTop / itemHeight);

            // Find the closest instance of the target hour
            let closestDistance = Infinity;
            let bestTargetIndex = itemsPerSet * 2 + targetHour; // Default to middle set

            for (let set = 0; set < totalSets; set++) {
                const candidateIndex = set * itemsPerSet + targetHour;
                const distance = Math.abs(candidateIndex - currentItemIndex);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    bestTargetIndex = candidateIndex;
                }
            }

            const scrollTop = (bestTargetIndex - centerOffset) * itemHeight;

            container.scrollTo({
                top: scrollTop,
                behavior: "smooth"
            });
        }

        // Center minutes scroller to show selected minute
        if (minutesScrollRef.current) {
            const container = minutesScrollRef.current;
            const containerHeight = container.clientHeight;
            const itemHeight = 40; // Height of each time item (h-10)
            const visibleItems = Math.floor(containerHeight / itemHeight);
            const centerOffset = Math.floor(visibleItems / 2);

            // Find all instances of the selected minute
            const targetMinute = selectedMinutes / 5; // Convert minutes to index (0-11)
            const totalSets = 5;
            const itemsPerSet = 12;

            // Calculate current scroll position in terms of item index
            const currentScrollTop = container.scrollTop;
            const currentItemIndex = Math.round(currentScrollTop / itemHeight);

            // Find the closest instance of the target minute
            let closestDistance = Infinity;
            let bestTargetIndex = itemsPerSet * 2 + targetMinute; // Default to middle set

            for (let set = 0; set < totalSets; set++) {
                const candidateIndex = set * itemsPerSet + targetMinute;
                const distance = Math.abs(candidateIndex - currentItemIndex);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    bestTargetIndex = candidateIndex;
                }
            }

            const scrollTop = (bestTargetIndex - centerOffset) * itemHeight;

            container.scrollTo({
                top: scrollTop,
                behavior: "smooth"
            });
        }
    }, [selectedHours, selectedMinutes]);

    // Initialize with current IST time when modal opens
    useEffect(() => {
        if (showModal) {
            const istTime = getCurrentISTTime();
            const currentHours = istTime.getHours();
            const currentMinutes = Math.ceil(istTime.getMinutes() / 5) * 5; // Round to nearest 5 minutes

            setSelectedHours(currentHours);
            setSelectedMinutes(currentMinutes);

            // Reset modal scroll position to top when opening
            setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.scrollTop = 0;
                }
            }, 50);
        }
    }, [showModal, getCurrentISTTime]);

    // FIXED: Center time scrollers immediately when modal opens with current time
    useEffect(() => {
        if (showModal) {
            // Delay to ensure DOM is updated and scrollers are rendered
            setTimeout(() => {
                centerSelectedTime();
            }, 100); // Reduced delay for immediate centering
        }
    }, [showModal, centerSelectedTime]);

    // Center time scrollers when values change after modal is open
    useEffect(() => {
        if (showModal) {
            // Only center when user actively changes values (not on initial load)
            const timeoutId = setTimeout(() => {
                centerSelectedTime();
            }, 50);

            return () => clearTimeout(timeoutId);
        }
    }, [selectedHours, selectedMinutes, showModal, centerSelectedTime]);

    // FIXED: Handle infinite scroll for hours
    const handleHoursScroll = useCallback(() => {
        if (!hoursScrollRef.current) return;

        const container = hoursScrollRef.current;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const itemHeight = 40;

        // Calculate total items and sets
        const totalItems = container.children.length;
        const itemsPerSet = 24; // 0-23 hours
        const totalSets = Math.floor(totalItems / itemsPerSet);
        const thresholdItems = 3; // Trigger when 3 items from edge

        // Check if near top (first set)
        if (scrollTop < thresholdItems * itemHeight) {
            const middleSetStart = itemsPerSet * Math.floor(totalSets / 2);
            const newScrollTop = middleSetStart * itemHeight + scrollTop;
            container.scrollTo({ top: newScrollTop, behavior: "auto" });
        }

        // Check if near bottom (last set)
        else if (scrollTop > scrollHeight - clientHeight - (thresholdItems * itemHeight)) {
            const middleSetStart = itemsPerSet * Math.floor(totalSets / 2);
            const currentSetPosition = scrollTop % (itemsPerSet * itemHeight);
            const newScrollTop = middleSetStart * itemHeight + currentSetPosition;
            container.scrollTo({ top: newScrollTop, behavior: "auto" });
        }
    }, []);

    // FIXED: Handle infinite scroll for minutes
    const handleMinutesScroll = useCallback(() => {
        if (!minutesScrollRef.current) return;

        const container = minutesScrollRef.current;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        const itemHeight = 40;

        // Calculate total items and sets
        const totalItems = container.children.length;
        const itemsPerSet = 12; // 0, 5, 10, ..., 55 minutes
        const totalSets = Math.floor(totalItems / itemsPerSet);
        const thresholdItems = 2; // Trigger when 2 items from edge

        // Check if near top (first set)
        if (scrollTop < thresholdItems * itemHeight) {
            const middleSetStart = itemsPerSet * Math.floor(totalSets / 2);
            const newScrollTop = middleSetStart * itemHeight + scrollTop;
            container.scrollTo({ top: newScrollTop, behavior: "auto" });
        }

        // Check if near bottom (last set)
        else if (scrollTop > scrollHeight - clientHeight - (thresholdItems * itemHeight)) {
            const middleSetStart = itemsPerSet * Math.floor(totalSets / 2);
            const currentSetPosition = scrollTop % (itemsPerSet * itemHeight);
            const newScrollTop = middleSetStart * itemHeight + currentSetPosition;
            container.scrollTo({ top: newScrollTop, behavior: "auto" });
        }
    }, []);

    // Generate quick date options
    const getQuickDates = useCallback((): DateOption[] => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return [
            { date: today, label: "Today", isToday: true, isTomorrow: false },
            { date: tomorrow, label: "Tomorrow", isToday: false, isTomorrow: true }
        ];
    }, []);

    // Generate calendar dates for current month
    const getCalendarDates = useCallback(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const dates = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time for accurate comparison
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 7);

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            date.setHours(0, 0, 0, 0); // Reset time for accurate comparison

            const isCurrentMonth = date.getMonth() === month;
            const isToday = date.getTime() === today.getTime();
            const isPastDate = date.getTime() < today.getTime();
            const isFutureLimit = date.getTime() > maxDate.getTime();
            const isSelectable = isCurrentMonth && !isPastDate && !isFutureLimit;

            dates.push({
                date: new Date(date),
                day: date.getDate(),
                isCurrentMonth,
                isToday,
                isPastDate,
                isFutureLimit,
                isSelectable
            });
        }

        return dates;
    }, [currentMonth]);

    // Validate selected datetime
    const validateDateTime = useCallback((date: Date, hours: number, minutes: number): string => {
        const selectedDateTime = new Date(date);
        selectedDateTime.setHours(hours, minutes, 0, 0);

        const now = new Date();
        const timeDiff = selectedDateTime.getTime() - now.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 4) {
            return "Booking must be at least 4 hours in advance";
        }

        const daysDiff = Math.ceil((selectedDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysDiff > 7) {
            return "Booking cannot be more than 7 days in advance";
        }

        return "";
    }, []);

    // Format display time
    const formatDisplayTime = useCallback((hours: number, minutes: number): string => {
        const period = hours >= 12 ? "PM" : "AM";
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const displayMinutes = minutes.toString().padStart(2, "0");
        return `${displayHours}:${displayMinutes} ${period}`;
    }, []);

    // Format display date
    const formatDisplayDate = useCallback((date: Date): string => {
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit"
        });
    }, []);

    // Handle date selection with proper today highlighting in calendar
    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date);
        setValidationError("");

        // If it"s today, set minimum time to now + 4 hours
        const now = new Date();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const selectedDateOnly = new Date(date);
        selectedDateOnly.setHours(0, 0, 0, 0);

        if (selectedDateOnly.getTime() === today.getTime()) {
            const minHours = now.getHours() + 4;
            if (minHours >= 24) {
                // If minimum time is next day, select tomorrow instead
                const tomorrow = new Date(date);
                tomorrow.setDate(date.getDate() + 1);
                setSelectedDate(tomorrow);
                setSelectedHours(minHours - 24);
            }
            else {
                setSelectedHours(minHours);
                setSelectedMinutes(Math.ceil(now.getMinutes() / 5) * 5);
            }
        }
    }, []);

    // Handle time scroll with centering
    const handleTimeScroll = useCallback((type: "hours" | "minutes", value: number) => {
        if (type === "hours") {
            setSelectedHours(value);
        }
        else {
            setSelectedMinutes(value);
        }
        setValidationError("");
    }, []);

    // Handle confirm selection
    const handleConfirm = useCallback(() => {
        if (!selectedDate) {
            setValidationError("Please select a date");
            return;
        }

        const error = validateDateTime(selectedDate, selectedHours, selectedMinutes);
        if (error) {
            setValidationError(error);
            return;
        }

        const finalDate = new Date(selectedDate);
        finalDate.setHours(selectedHours, selectedMinutes, 0, 0);

        onSelect(finalDate);
        setShowModal(false);
        setValidationError("");
    }, [selectedDate, selectedHours, selectedMinutes, validateDateTime, onSelect]);

    // Handle modal close
    const handleClose = useCallback(() => {
        setShowModal(false);
        setValidationError("");
        setShowCalendar(false);
    }, []);

    // Enhanced backdrop click with proper event handling
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
        }
    }, [handleClose]);

    // FIXED: Generate infinite hours (multiple sets for smooth infinite scroll)
    const generateInfiniteHours = useCallback(() => {
        const hours = [];
        const sets = 5; // Generate 5 sets for smooth infinite scrolling

        for (let set = 0; set < sets; set++) {
            for (let hour = 0; hour < 24; hour++) {
                hours.push(hour);
            }
        }

        return hours;
    }, []);

    // FIXED: Generate infinite minutes (multiple sets for smooth infinite scroll)
    const generateInfiniteMinutes = useCallback(() => {
        const minutes = [];
        const sets = 5; // Generate 5 sets for smooth infinite scrolling

        for (let set = 0; set < sets; set++) {
            for (let i = 0; i < 12; i++) {
                minutes.push(i * 5); // 0, 5, 10, 15, ..., 55
            }
        }

        return minutes;
    }, []);

    // Comprehensive modal isolation and background interaction prevention
    useEffect(() => {
        if (showModal) {
            // Prevent background scrolling and interaction
            const scrollY = window.scrollY;
            document.body.style.position = "fixed";
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = "0";
            document.body.style.right = "0";
            document.body.style.width = "100%";
            document.body.style.overflow = "hidden";
            document.body.style.touchAction = "none";

            document.body.classList.add("modal-open");

            const handleTouchMove = (e: TouchEvent) => {
                if (!modalRef.current?.contains(e.target as Node)) {
                    e.preventDefault();
                }
            };

            const handleWheel = (e: WheelEvent) => {
                if (!modalRef.current?.contains(e.target as Node)) {
                    e.preventDefault();
                }
            };

            document.addEventListener("touchmove", handleTouchMove, { passive: false });
            document.addEventListener("wheel", handleWheel, { passive: false });

            return () => {
                document.removeEventListener("touchmove", handleTouchMove);
                document.removeEventListener("wheel", handleWheel);
            };
        }
        else {
            const scrollY = parseInt(document.body.style.top || "0") * -1;
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            document.body.classList.remove("modal-open");

            if (scrollY) {
                window.scrollTo(0, scrollY);
            }
        }

        return () => {
            document.body.style.position = "";
            document.body.style.top = "";
            document.body.style.left = "";
            document.body.style.right = "";
            document.body.style.width = "";
            document.body.style.overflow = "";
            document.body.style.touchAction = "";
            document.body.classList.remove("modal-open");
        };
    }, [showModal, modalRef]);

    // Enhanced keyboard event handling with better modal focus management
    useEffect(() => {
        if (!showModal) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
            }

            if (e.key === "Tab" && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    "button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])"
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
                else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener("keydown", handleKeyDown, true);
        return () => document.removeEventListener("keydown", handleKeyDown, true);
    }, [showModal, handleClose]);

    // Format input display value
    const getInputDisplayValue = useCallback(() => {
        if (!value) return "";
        return `${formatDisplayDate(value)}, ${formatDisplayTime(value.getHours(), value.getMinutes())}`;
    }, [value, formatDisplayDate, formatDisplayTime]);

    const quickDates = getQuickDates();
    const calendarDates = getCalendarDates();
    const currentMonthName = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

    // FIXED: Get infinite arrays for hours and minutes
    const infiniteHours = generateInfiniteHours();
    const infiniteMinutes = generateInfiniteMinutes();

    return (
        <>
            {/* Input Field */}
            <button
                onClick={() => !disabled && setShowModal(true)}
                disabled={disabled}
                className={`w-full p-3 border rounded-lg text-left transition-colors ${disabled
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : value
                        ? "border-gray-300 bg-white text-gray-900 hover:border-gray-400 cursor-pointer"
                        : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 cursor-pointer"
                    }`}
            >
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {getInputDisplayValue() || placeholder}
                    </span>
                    <i className="ri-calendar-line text-gray-400" />
                </div>
            </button>

            {/* Modal with maximum z-index and complete isolation */}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-end justify-center"
                    style={{
                        zIndex: 9999,
                        isolation: "isolate"
                    }}
                    onClick={handleBackdropClick}
                    onTouchStart={(e) => e.stopPropagation()}
                    onTouchMove={(e) => e.stopPropagation()}
                >
                    {/* Enhanced backdrop with pointer events control */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        style={{
                            backdropFilter: "blur(2px)",
                            WebkitBackdropFilter: "blur(2px)"
                        }}
                        onClick={handleBackdropClick}
                    />

                    <div
                        ref={modalRef}
                        className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl transform transition-all duration-300 ease-out flex flex-col"
                        style={{
                            height: "75vh",
                            maxHeight: "75vh",
                            zIndex: 10000
                        }}
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchMove={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-white rounded-t-3xl">
                            <h2 className="text-xl font-semibold text-gray-900">Schedule</h2>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <i className="ri-close-line text-xl text-gray-600" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div
                            className="flex-1 overflow-y-auto"
                            style={{
                                overscrollBehavior: "contain",
                                WebkitOverflowScrolling: "touch"
                            }}
                        >
                            <div className="p-6 space-y-6">
                                {/* Date Selection */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Select Date</h3>

                                    {/* Quick Dates */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {quickDates.map((option, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleDateSelect(option.date)}
                                                className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${selectedDate?.toDateString() === option.date.toDateString()
                                                    ? "border-gray-900 bg-gray-50"
                                                    : "border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                <div className="text-sm font-medium text-gray-900">{option.label}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDisplayDate(option.date)}
                                                </div>
                                            </button>
                                        ))}
                                    </div>

                                    {/* Select Date Button */}
                                    <button
                                        onClick={() => setShowCalendar(!showCalendar)}
                                        className="w-full p-3 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-left">
                                                <div className="text-sm font-medium text-gray-900">Select Date</div>
                                                <div className="text-xs text-gray-500">Choose from calendar</div>
                                            </div>
                                            {showCalendar ? (
                                                <i className="ri-arrow-up-s-line text-gray-400 transition-transform" />
                                            ) : (
                                                <i className="ri-arrow-down-s-line text-gray-400 transition-transform" />
                                            )}
                                        </div>
                                    </button>

                                    {/* Calendar */}
                                    {showCalendar && (
                                        <div className="mt-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
                                            {/* Calendar Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <button
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                                >
                                                    <i className="ri-arrow-left-line text-gray-600" />
                                                </button>
                                                <h4 className="font-medium text-gray-900">{currentMonthName}</h4>
                                                <button
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                                >
                                                    <i className="ri-arrow-right-line text-gray-600" />
                                                </button>
                                            </div>

                                            {/* Calendar Grid */}
                                            <div className="grid grid-cols-7 gap-1">
                                                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                                                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                                                        {day}
                                                    </div>
                                                ))}
                                                {calendarDates.map((dateInfo, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => dateInfo.isSelectable && handleDateSelect(dateInfo.date)}
                                                        disabled={!dateInfo.isSelectable}
                                                        className={`h-8 w-8 text-xs rounded flex items-center justify-center transition-colors cursor-pointer ${selectedDate?.toDateString() === dateInfo.date.toDateString()
                                                            ? "bg-gray-900 text-white"
                                                            : dateInfo.isToday
                                                                ? "bg-blue-100 text-blue-600 font-medium"
                                                                : dateInfo.isSelectable
                                                                    ? "hover:bg-gray-200 text-gray-900"
                                                                    : "text-gray-300 cursor-not-allowed"
                                                            } ${!dateInfo.isCurrentMonth ? "opacity-30" : ""}`}
                                                    >
                                                        {dateInfo.day}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Time Selection */}
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Select Time</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Hours - FIXED: Infinite scroll with proper centering */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-2">Hours</label>
                                            <div
                                                ref={hoursScrollRef}
                                                className="h-32 overflow-y-auto border border-gray-200 rounded-lg bg-white relative"
                                                style={{
                                                    overscrollBehavior: "contain",
                                                    scrollSnapType: "y mandatory"
                                                }}
                                                onScroll={handleHoursScroll}
                                            >
                                                {infiniteHours.map((hour, index) => (
                                                    <button
                                                        key={`hour-${index}`}
                                                        onClick={() => handleTimeScroll("hours", hour)}
                                                        className={`w-full h-10 flex items-center justify-center text-sm transition-colors scroll-snap-align-center cursor-pointer ${selectedHours === hour
                                                            ? "bg-gray-900 text-white font-medium"
                                                            : "hover:bg-gray-100 text-gray-900"
                                                            }`}
                                                        style={{ scrollSnapAlign: "center" }}
                                                    >
                                                        {hour.toString().padStart(2, "0")}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Minutes - FIXED: Infinite scroll with proper centering */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-2">Minutes</label>
                                            <div
                                                ref={minutesScrollRef}
                                                className="h-32 overflow-y-auto border border-gray-200 rounded-lg bg-white relative"
                                                style={{
                                                    overscrollBehavior: "contain",
                                                    scrollSnapType: "y mandatory"
                                                }}
                                                onScroll={handleMinutesScroll}
                                            >
                                                {infiniteMinutes.map((minute, index) => (
                                                    <button
                                                        key={`minute-${index}`}
                                                        onClick={() => handleTimeScroll("minutes", minute)}
                                                        className={`w-full h-10 flex items-center justify-center text-sm transition-colors scroll-snap-align-center cursor-pointer ${selectedMinutes === minute
                                                            ? "bg-gray-900 text-white font-medium"
                                                            : "hover:bg-gray-100 text-gray-900"
                                                            }`}
                                                        style={{ scrollSnapAlign: "center" }}
                                                    >
                                                        {minute.toString().padStart(2, "0")}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Time Preview */}
                                    <div className="mt-3 p-2 bg-gray-50 rounded-lg">
                                        <div className="text-center">
                                            <span className="text-sm text-gray-600">Selected time: </span>
                                            <span className="text-sm font-medium text-gray-900">
                                                {formatDisplayTime(selectedHours, selectedMinutes)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div
                            className="p-6 border-t border-gray-100 bg-white flex-shrink-0"
                            style={{
                                borderTop: "1px solid #f3f4f6",
                                boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            {validationError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{validationError}</p>
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                disabled={!selectedDate}
                                className={`w-full py-4 rounded-xl font-medium text-base transition-all ${selectedDate
                                    ? "bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 cursor-pointer"
                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                                style={{
                                    position: "relative",
                                    zIndex: 10001
                                }}
                            >
                                {selectedDate
                                    ? `${formatDisplayDate(selectedDate)}, ${formatDisplayTime(selectedHours, selectedMinutes)}`
                                    : "Select The Date"
                                }
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default DateTimePicker