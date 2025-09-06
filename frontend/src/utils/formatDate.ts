export const formatDate = (dateStr?: string): string => {
    if (!dateStr) return "";

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;

    try {
        return new Intl.DateTimeFormat("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date);
    }
    catch {
        return dateStr;
    }
};