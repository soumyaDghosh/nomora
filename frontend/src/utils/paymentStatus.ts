export const getPaymentStatusConfig = (status: string) => {
    switch (status) {
        case "paid":
            return { label: "Paid", bgColor: "bg-green-100", textColor: "text-green-800" };
        case "unpaid":
            return { label: "Unpaid", bgColor: "bg-orange-100", textColor: "text-orange-800" };
        // case "advance-paid":
        //     return { label: "Advance Paid", bgColor: "bg-yellow-100", textColor: "text-yellow-800" };
        case "refunded":
            return { label: "Refunded", bgColor: "bg-purple-100", textColor: "text-purple-800" };
        default:
            return { label: "Unknown", bgColor: "bg-gray-100", textColor: "text-gray-800" };
    }
};