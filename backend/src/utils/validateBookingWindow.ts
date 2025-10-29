export function validateBookingWindow(bookingDate: string): string | null {
    // Parse the booking date (format: YYYY-MM-DD)
    const [year, month, day] = bookingDate.split('-').map(Number);
    const booking = new Date(year, month - 1, day);
    booking.setHours(0, 0, 0, 0);

    // Get current time in IST
    const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    const todayIST = new Date(nowIST);
    todayIST.setHours(0, 0, 0, 0);

    // Calculate day difference
    const diffTime = booking.getTime() - todayIST.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // Rule 1: T (today) - Not allowed
    if (diffDays === 0) {
        return "Same-day bookings aren't available. Please select a later date.";
    }

    // Rule 2: T+1 (tomorrow) - Allowed only until 8:00 PM today
    if (diffDays === 1) {
        const currentHour = nowIST.getHours();
        const currentMinute = nowIST.getMinutes();
        
        // After 8:05 PM (20:05), block T+1 bookings (5-min grace period)
        if (currentHour > 20 || (currentHour === 20 && currentMinute >= 5)) {
            return "Bookings for tomorrow's slots are allowed until 8:00 PM today. Please select a later date.";
        }
    }

    // Rule 3: T+2 to T+7 - Allowed anytime
    if (diffDays >= 2 && diffDays <= 7) {
        return null; // Valid booking window
    }

    // Rule 4: Beyond T+7 - Not allowed
    if (diffDays > 7) {
        return "Bookings can only be made up to 7 days in advance. Please select an earlier date.";
    }

    // Fallback for any edge cases (negative days, etc.)
    return "Invalid booking date. Please select a valid future date.";
}