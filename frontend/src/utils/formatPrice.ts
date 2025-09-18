export const formatPrice = (value?: string | number): string => {
    if (value === null || value === undefined) return "₹0";

    const num = typeof value === "string" ? parseFloat(value) : value;

    // const hasDecimals = num % 1 !== 0;

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(num).replace("₹", "₹");
}