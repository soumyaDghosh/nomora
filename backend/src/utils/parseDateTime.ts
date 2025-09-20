export function parseDateTime(date: string, time: string): Date {
    let normalized = time.trim().toUpperCase();
    if (!normalized.includes(":")) {
        normalized = normalized.replace(/ (AM|PM)$/, ":00 $1");
    }

    const [year, month, day] = date.split("-").map(Number);

    const match = normalized.match(/^(\d{1,2})(?::(\d{2}))? (AM|PM)$/);
    if (!match) {
        throw new Error(`Invalid time format after normalization: ${normalized}`);
    }

    let hour = Number(match[1]);
    const minute = match[2] ? Number(match[2]) : 0;
    const meridiem = match[3];

    if (meridiem === "PM" && hour !== 12) hour += 12;
    if (meridiem === "AM" && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, minute, 0, 0);
}

export function formatBookingDate(date: string): string {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}