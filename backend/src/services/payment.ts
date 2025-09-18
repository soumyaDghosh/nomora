import Razorpay from "razorpay";

interface GetPaymentOrderParams {
    receipt_id: string;
    amount: number;
}

interface PaymentOrderResponse {
    id: string;
    amount: number | string;
}

interface GetPaymentStatusParams {
    order_id: string;
    payment_id?: string;
}

interface PaymentStatusResponse {
    status: "PENDING" | "COMPLETED" | "FAILED";
    payment_method?: string;
    amount?: number | string;
}

interface RazorpayPayment {
    id: string;
    status: string;
    method: string;
    amount: number | string;
    [key: string]: any;
}

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET ?? ""

const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET,
});

export async function getPaymentOrder({
    receipt_id,
    amount
}: GetPaymentOrderParams): Promise<PaymentOrderResponse> {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay keys not found");
    }

    try {
        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: receipt_id
        });

        return {
            id: order.id,
            amount: order.amount,
        };
    }
    catch (error: any) {
        throw new Error(error?.error?.description || error?.message || "Payment initiation failed. Try again.");
    }
};

export async function getPaymentStatus({
    order_id,
    payment_id
}: GetPaymentStatusParams): Promise<PaymentStatusResponse> {
    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
        throw new Error("Razorpay keys not found");
    }

    if (!payment_id) {
        return { status: "FAILED" };
    }

    try {
        const response = await razorpay.orders.fetchPayments(order_id);
        const payments: RazorpayPayment[] = response.items;

        if (!Array.isArray(payments) || payments.length === 0) {
            return { status: "FAILED" };
        }

        const targetPayment = payments.find((payment) => payment.id === payment_id);

        if (!targetPayment) {
            return { status: "FAILED" };
        }

        if (targetPayment.status === "created") {
            return { status: "PENDING" };
        }

        if (targetPayment.status === "captured") {
            return {
                status: "COMPLETED",
                payment_method: targetPayment.method,
                amount: targetPayment.amount,
            };
        }

        if (targetPayment.status === "failed") {
            return {
                status: "FAILED",
                payment_method: targetPayment.method,
                amount: targetPayment.amount,
            };
        }

        return { status: "FAILED" };
    }
    catch (error: any) {
        throw new Error(error?.error?.description || error?.message || "Failed to fetch payment status.");
    }
};