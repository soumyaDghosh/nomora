export const getBookingErrorMessage = (
  selectedDate: string,
  currentDateString: string,
  tomorrowDateString: string,
  currentHours: number,
  currentMinutes: number
) => {
  // Check for same-day booking
  if (selectedDate === currentDateString) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3">
        <p className="text-red-700 text-sm">
          Same-day bookings aren't available. Please select later date.
        </p>
      </div>
    );
  }

  // Check for tomorrow booking after cutoff time
  const isTomorrowBooking = selectedDate === tomorrowDateString;
  const isPastCutoff =
    currentHours > 20 || (currentHours === 20 && currentMinutes >= 5);

  if (isTomorrowBooking && isPastCutoff) {
    return (
      <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-3">
        <p className="text-red-700 text-sm">
          Bookings for tomorrow's morning slots are allowed until 8:00 PM today.
          Please select a later date.
        </p>
      </div>
    );
  }

  return null;
};

