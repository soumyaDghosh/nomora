export default function getVehicleSeat (name: string): string {
    const seatMap: Record<string, string> = {
        Go: "3+1",
        Prime: "4+1",
        Edge: "4+1",
        Max: "6+1"
    };

    return seatMap[name];
};