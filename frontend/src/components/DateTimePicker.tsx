import { useState, useEffect, useRef, useCallback } from 'react';

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
    const [validationError, setValidationError] = useState<string>('');
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [isInitialized, setIsInitialized] = useState(false);

    const modalRef = useRef<HTMLDivElement>(null);
    const hoursScrollRef = useRef<HTMLDivElement>(null);
    const minutesScrollRef = useRef<HTMLDivElement>(null);

    // Get current IST time
    const getCurrentISTTime = useCallback(() => {
        const now = new Date();
        const istOffset = 5.5 * 60 * 60 * 1000;
        const utc = now.getTime() + (now.getTimezoneOffset() * 60 * 1000);
        const istTime = new Date(utc + istOffset);
        return istTime;
    }, []);

    // Initialize time only once when modal opens
    useEffect(() => {
        if (showModal && !isInitialized) {
            const istTime = getCurrentISTTime();
            const currentHours = istTime.getHours();
            const currentMinutes = Math.round(istTime.getMinutes() / 5) * 5;

            setSelectedHours(currentHours);
            setSelectedMinutes(currentMinutes >= 60 ? 0 : currentMinutes);
            setIsInitialized(true);

            // Reset modal scroll position immediately
            if (modalRef.current) {
                modalRef.current.scrollTop = 0;
            }
        }

        // Reset initialization when modal closes
        if (!showModal) {
            setIsInitialized(false);
        }
    }, [showModal, isInitialized, getCurrentISTTime]);

    // Center scrollers after initialization
    const centerTimeScrollers = useCallback(() => {
        if (!showModal || !isInitialized) return;

        requestAnimationFrame(() => {
            // Center hours scroller
            if (hoursScrollRef.current) {
                const container = hoursScrollRef.current;
                const itemHeight = 48;
                const containerHeight = container.clientHeight;
                const visibleItems = Math.floor(containerHeight / itemHeight);
                const centerOffset = Math.floor(visibleItems / 2);

                // Find target hour in the middle set (set 2 of 0-4)
                const middleSetStart = 2 * 24;
                const targetIndex = middleSetStart + selectedHours;
                const scrollTop = Math.max(0, (targetIndex - centerOffset) * itemHeight);

                container.scrollTop = scrollTop;
            }

            // Center minutes scroller
            if (minutesScrollRef.current) {
                const container = minutesScrollRef.current;
                const itemHeight = 48;
                const containerHeight = container.clientHeight;
                const visibleItems = Math.floor(containerHeight / itemHeight);
                const centerOffset = Math.floor(visibleItems / 2);

                // Find target minute in the middle set (set 2 of 0-4)
                const middleSetStart = 2 * 12;
                const targetIndex = middleSetStart + (selectedMinutes / 5);
                const scrollTop = Math.max(0, (targetIndex - centerOffset) * itemHeight);

                container.scrollTop = scrollTop;
            }
        });
    }, [showModal, isInitialized, selectedHours, selectedMinutes]);

    // Center scrollers when initialized
    useEffect(() => {
        if (showModal && isInitialized) {
            const timer = setTimeout(() => {
                centerTimeScrollers();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [showModal, isInitialized, centerTimeScrollers]);

    // Handle hours scroll with infinite scroll and center value detection
    const handleHoursScroll = useCallback(() => {
        if (!hoursScrollRef.current || !isInitialized) return;

        const container = hoursScrollRef.current;
        const scrollTop = container.scrollTop;
        const itemHeight = 48;
        const containerHeight = container.clientHeight;
        const visibleItems = Math.floor(containerHeight / itemHeight);
        const centerOffset = Math.floor(visibleItems / 2);

        // Calculate which item is in the center
        const centerItemIndex = Math.round(scrollTop / itemHeight) + centerOffset;
        const currentHour = centerItemIndex % 24;

        // Update selected hour if different
        if (currentHour !== selectedHours) {
            setSelectedHours(currentHour);
            setValidationError('');
        }

        // Handle infinite scroll - jump to middle set when near edges
        const totalItems = 5 * 24;
        const itemsPerSet = 24;
        const thresholdItems = 12;
        const currentTopItem = Math.round(scrollTop / itemHeight);

        // If near top (first set), jump to middle set
        if (currentTopItem < thresholdItems) {
            const middleSetStart = 2 * itemsPerSet;
            const newScrollTop = (middleSetStart + currentHour - centerOffset) * itemHeight;
            container.scrollTop = newScrollTop;
        }
        // If near bottom (last set), jump to middle set
        else if (currentTopItem > totalItems - thresholdItems - visibleItems) {
            const middleSetStart = 2 * itemsPerSet;
            const newScrollTop = (middleSetStart + currentHour - centerOffset) * itemHeight;
            container.scrollTop = newScrollTop;
        }
    }, [selectedHours, isInitialized]);

    // Handle minutes scroll with infinite scroll and center value detection
    const handleMinutesScroll = useCallback(() => {
        if (!minutesScrollRef.current || !isInitialized) return;

        const container = minutesScrollRef.current;
        const scrollTop = container.scrollTop;
        const itemHeight = 48;
        const containerHeight = container.clientHeight;
        const visibleItems = Math.floor(containerHeight / itemHeight);
        const centerOffset = Math.floor(visibleItems / 2);

        // Calculate which item is in the center
        const centerItemIndex = Math.round(scrollTop / itemHeight) + centerOffset;
        const currentMinute = (centerItemIndex % 12) * 5;

        // Update selected minute if different
        if (currentMinute !== selectedMinutes) {
            setSelectedMinutes(currentMinute);
            setValidationError('');
        }

        // Handle infinite scroll - jump to middle set when near edges
        const totalItems = 5 * 12;
        const itemsPerSet = 12;
        const thresholdItems = 6;
        const currentTopItem = Math.round(scrollTop / itemHeight);

        // If near top (first set), jump to middle set
        if (currentTopItem < thresholdItems) {
            const middleSetStart = 2 * itemsPerSet;
            const newScrollTop = (middleSetStart + (currentMinute / 5) - centerOffset) * itemHeight;
            container.scrollTop = newScrollTop;
        }
        // If near bottom (last set), jump to middle set
        else if (currentTopItem > totalItems - thresholdItems - visibleItems) {
            const middleSetStart = 2 * itemsPerSet;
            const newScrollTop = (middleSetStart + (currentMinute / 5) - centerOffset) * itemHeight;
            container.scrollTop = newScrollTop;
        }
    }, [selectedMinutes, isInitialized]);

    // Generate quick date options
    const getQuickDates = useCallback((): DateOption[] => {
        const istTime = getCurrentISTTime();
        const today = new Date(istTime.getFullYear(), istTime.getMonth(), istTime.getDate());
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        return [
            { date: today, label: 'Today', isToday: true, isTomorrow: false },
            { date: tomorrow, label: 'Tomorrow', isToday: false, isTomorrow: true }
        ];
    }, [getCurrentISTTime]);

    // Generate calendar dates for current month with proper T+7 inclusion
    const getCalendarDates = useCallback(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const dates = [];
        const istTime = getCurrentISTTime();
        const today = new Date(istTime.getFullYear(), istTime.getMonth(), istTime.getDate());
        const maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 7);

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            date.setHours(0, 0, 0, 0);

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
    }, [currentMonth, getCurrentISTTime]);

    // Validate selected datetime with proper T+7 inclusion
    const validateDateTime = useCallback((date: Date, hours: number, minutes: number): string => {
        const selectedDateTime = new Date(date);
        selectedDateTime.setHours(hours, minutes, 0, 0);

        const istTime = getCurrentISTTime();
        const timeDiff = selectedDateTime.getTime() - istTime.getTime();
        const hoursDiff = timeDiff / (1000 * 60 * 60);

        if (hoursDiff < 4) {
            return 'Booking must be at least 4 hours in advance';
        }

        const todayStart = new Date(istTime.getFullYear(), istTime.getMonth(), istTime.getDate());
        const selectedDateStart = new Date(selectedDateTime.getFullYear(), selectedDateTime.getMonth(), selectedDateTime.getDate());
        const daysDiff = Math.floor((selectedDateStart.getTime() - todayStart.getTime()) / (1000 * 60 * 60 * 24));

        if (daysDiff > 7) {
            return 'Booking cannot be more than 7 days in advance';
        }

        return '';
    }, [getCurrentISTTime]);

    // Format display time
    const formatDisplayTime = useCallback((hours: number, minutes: number): string => {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
        const displayMinutes = minutes.toString().padStart(2, '0');
        return `${displayHours}:${displayMinutes} ${period}`;
    }, []);

    // Format display date
    const formatDisplayDate = useCallback((date: Date): string => {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit'
        });
    }, []);

    // Handle date selection
    const handleDateSelect = useCallback((date: Date) => {
        setSelectedDate(date);
        setValidationError('');

        // If it's today, set minimum time to now + 4 hours
        const istTime = getCurrentISTTime();
        const today = new Date(istTime.getFullYear(), istTime.getMonth(), istTime.getDate());
        const selectedDateOnly = new Date(date);
        selectedDateOnly.setHours(0, 0, 0, 0);

        if (selectedDateOnly.getTime() === today.getTime()) {
            const minHours = istTime.getHours() + 4;
            if (minHours >= 24) {
                const tomorrow = new Date(date);
                tomorrow.setDate(date.getDate() + 1);
                setSelectedDate(tomorrow);
                setSelectedHours(minHours - 24);
            } else {
                setSelectedHours(minHours);
                setSelectedMinutes(Math.ceil(istTime.getMinutes() / 5) * 5);
            }
        }
    }, [getCurrentISTTime]);

    // Handle confirm selection
    const handleConfirm = useCallback(() => {
        if (!selectedDate) {
            setValidationError('Please select a date');
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
        setValidationError('');
        setIsInitialized(false);
    }, [selectedDate, selectedHours, selectedMinutes, validateDateTime, onSelect]);

    // Handle modal close
    const handleClose = useCallback(() => {
        setShowModal(false);
        setValidationError('');
        setShowCalendar(false);
        setIsInitialized(false);
    }, []);

    // Handle backdrop click
    const handleBackdropClick = useCallback((e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            e.preventDefault();
            e.stopPropagation();
            handleClose();
        }
    }, [handleClose]);

    // Generate infinite hours (5 sets for smooth infinite scroll)
    const generateInfiniteHours = useCallback(() => {
        const hours = [];
        for (let set = 0; set < 5; set++) {
            for (let hour = 0; hour < 24; hour++) {
                hours.push(hour);
            }
        }
        return hours;
    }, []);

    // Generate infinite minutes (5 sets for smooth infinite scroll)
    const generateInfiniteMinutes = useCallback(() => {
        const minutes = [];
        for (let set = 0; set < 5; set++) {
            for (let i = 0; i < 12; i++) {
                minutes.push(i * 5);
            }
        }
        return minutes;
    }, []);

    // Modal background interaction prevention
    useEffect(() => {
        if (showModal) {
            const scrollY = window.scrollY;
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollY}px`;
            document.body.style.left = '0';
            document.body.style.right = '0';
            document.body.style.width = '100%';
            document.body.style.overflow = 'hidden';
            document.body.style.touchAction = 'none';

            document.body.classList.add('modal-open');

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

            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('wheel', handleWheel);
            };
        } else {
            const scrollY = parseInt(document.body.style.top || '0') * -1;
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.body.classList.remove('modal-open');

            if (scrollY) {
                window.scrollTo(0, scrollY);
            }
        }

        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            document.body.style.touchAction = '';
            document.body.classList.remove('modal-open');
        };
    }, [showModal, modalRef]);

    // Keyboard event handling
    useEffect(() => {
        if (!showModal) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
            }

            if (e.key === 'Tab' && modalRef.current) {
                const focusableElements = modalRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown, true);
        return () => document.removeEventListener('keydown', handleKeyDown, true);
    }, [showModal, handleClose]);

    // Format input display value
    const getInputDisplayValue = useCallback(() => {
        if (!value) return '';
        return `${formatDisplayDate(value)}, ${formatDisplayTime(value.getHours(), value.getMinutes())}`;
    }, [value, formatDisplayDate, formatDisplayTime]);

    const quickDates = getQuickDates();
    const calendarDates = getCalendarDates();
    const currentMonthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const infiniteHours = generateInfiniteHours();
    const infiniteMinutes = generateInfiniteMinutes();

    return (
        <>
            {/* Input Field */}
            <button
                onClick={() => !disabled && setShowModal(true)}
                disabled={disabled}
                className={`w-full p-3 border rounded-lg text-left transition-colors ${disabled
                    ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                    : value
                        ? 'border-gray-300 bg-white text-gray-900 hover:border-gray-400 cursor-pointer'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 cursor-pointer'
                    }`}
            >
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {getInputDisplayValue() || placeholder}
                    </span>
                    <i className="ri-calendar-line text-gray-400"></i>
                </div>
            </button>

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 flex items-end justify-center"
                    style={{ zIndex: 9999 }}
                    onClick={handleBackdropClick}
                >
                    <div
                        className="absolute inset-0 bg-black/60"
                        style={{
                            backdropFilter: 'blur(2px)',
                            WebkitBackdropFilter: 'blur(2px)'
                        }}
                        onClick={handleBackdropClick}
                    />

                    <div
                        ref={modalRef}
                        className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl transform transition-all duration-300 ease-out flex flex-col"
                        style={{
                            height: '85vh',
                            maxHeight: '85vh'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0 bg-white rounded-t-3xl">
                            <h2 className="text-xl font-semibold text-gray-900">Schedule</h2>
                            <button
                                onClick={handleClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <i className="ri-close-line text-xl text-gray-600"></i>
                            </button>
                        </div>

                        {/* Scrollable Content Container */}
                        <div className="flex-1 overflow-y-auto">
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
                                                    ? 'border-gray-900 bg-gray-50'
                                                    : 'border-gray-200 hover:border-gray-300'
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
                                            <i className={`ri-arrow-${showCalendar ? 'up' : 'down'}-s-line text-gray-400 transition-transform`}></i>
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
                                                    <i className="ri-arrow-left-line text-gray-600"></i>
                                                </button>
                                                <h4 className="font-medium text-gray-900">{currentMonthName}</h4>
                                                <button
                                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
                                                >
                                                    <i className="ri-arrow-right-line text-gray-600"></i>
                                                </button>
                                            </div>

                                            {/* Calendar Grid */}
                                            <div className="grid grid-cols-7 gap-1">
                                                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                                    <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
                                                        {day}
                                                    </div>
                                                ))}
                                                {calendarDates.map((dateInfo, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => dateInfo.isSelectable && handleDateSelect(dateInfo.date)}
                                                        disabled={!dateInfo.isSelectable}
                                                        className={`h-8 w-8 text-xs rounded flex items-center justify-center transition-colors ${selectedDate?.toDateString() === dateInfo.date.toDateString()
                                                            ? 'bg-gray-900 text-white cursor-pointer'
                                                            : dateInfo.isToday
                                                                ? 'bg-blue-100 text-blue-600 font-medium cursor-pointer'
                                                                : dateInfo.isSelectable
                                                                    ? 'hover:bg-gray-200 text-gray-900 cursor-pointer'
                                                                    : 'text-gray-300 cursor-not-allowed'
                                                            } ${!dateInfo.isCurrentMonth ? 'opacity-30' : ''}`}
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
                                        {/* Hours - FIXED: Moved highlight outside scroll container */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-2">Hours</label>
                                            <div className="relative">
                                                {/* FIXED: Highlight as sibling overlay outside scroll container */}
                                                <div
                                                    className="absolute left-0 right-0 pointer-events-none rounded-lg"
                                                    style={{
                                                        top: 'calc(50% - 24px)',
                                                        height: '48px',
                                                        backgroundColor: '#111827',
                                                        zIndex: 10
                                                    }}
                                                />
                                                <div
                                                    ref={hoursScrollRef}
                                                    className="h-36 overflow-y-auto border border-gray-200 rounded-lg bg-white"
                                                    style={{
                                                        overscrollBehavior: 'contain',
                                                        scrollSnapType: 'y mandatory'
                                                    }}
                                                    onScroll={handleHoursScroll}
                                                >
                                                    {infiniteHours.map((hour, index) => (
                                                        <div
                                                            key={`hour-${index}`}
                                                            className="h-12 flex items-center justify-center text-sm font-medium relative"
                                                            style={{
                                                                scrollSnapAlign: 'center',
                                                                color: selectedHours === hour ? '#ffffff' : '#6B7280',
                                                                zIndex: 20
                                                            }}
                                                        >
                                                            {hour.toString().padStart(2, '0')}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Minutes - FIXED: Moved highlight outside scroll container */}
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-2">Minutes</label>
                                            <div className="relative">
                                                {/* FIXED: Highlight as sibling overlay outside scroll container */}
                                                <div
                                                    className="absolute left-0 right-0 pointer-events-none rounded-lg"
                                                    style={{
                                                        top: 'calc(50% - 24px)',
                                                        height: '48px',
                                                        backgroundColor: '#111827',
                                                        zIndex: 10
                                                    }}
                                                />
                                                <div
                                                    ref={minutesScrollRef}
                                                    className="h-36 overflow-y-auto border border-gray-200 rounded-lg bg-white"
                                                    style={{
                                                        overscrollBehavior: 'contain',
                                                        scrollSnapType: 'y mandatory'
                                                    }}
                                                    onScroll={handleMinutesScroll}
                                                >
                                                    {infiniteMinutes.map((minute, index) => (
                                                        <div
                                                            key={`minute-${index}`}
                                                            className="h-12 flex items-center justify-center text-sm font-medium relative"
                                                            style={{
                                                                scrollSnapAlign: 'center',
                                                                color: selectedMinutes === minute ? '#ffffff' : '#6B7280',
                                                                zIndex: 20
                                                            }}
                                                        >
                                                            {minute.toString().padStart(2, '0')}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Selected Time Display */}
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                                        <span className="text-sm text-gray-600">Selected time: </span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {formatDisplayTime(selectedHours, selectedMinutes)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer - Always visible at bottom */}
                        <div className="p-6 border-t border-gray-100 bg-white flex-shrink-0">
                            {validationError && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-600">{validationError}</p>
                                </div>
                            )}

                            <button
                                onClick={handleConfirm}
                                disabled={!selectedDate}
                                className={`w-full py-4 rounded-xl font-medium text-base transition-all ${selectedDate
                                    ? 'bg-gray-900 text-white hover:bg-gray-800 active:bg-gray-950 cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {selectedDate
                                    ? `${formatDisplayDate(selectedDate)}, ${formatDisplayTime(selectedHours, selectedMinutes)}`
                                    : 'Select The Date'
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