export const getVehicleSeat = (name?: string): string => {
    const seatMap: Record<string, string> = {
        Go: "3+1 Seats",
        Prime: "4+1 Seats",
        Edge: "4+1 Seats",
        Max: "6+1 Seats"
    };

    if (!name) return "Unknown Seats";
    return seatMap[name] ?? "Unknown Seats";
};