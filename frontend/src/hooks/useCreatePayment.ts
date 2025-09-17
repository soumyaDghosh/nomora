import useVerifyPayment from "./useVerifyPayment";
import useAuthStore from "../store/authStore";
import type { RazorpayPaymentResponse } from "../global";

interface CreatePaymentProps {
    booking_id: string,
    order_id: string,
    order_amount: number
}

export default function useCreatePayment() {
    const { verifyPayment } = useVerifyPayment();

    const { user } = useAuthStore();

    const createPayment = ({ booking_id, order_id, order_amount }: CreatePaymentProps): Promise<boolean> => {
        return new Promise((resolve) => {
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order_amount,
                currency: "INR",
                order_id,
                prefill: {
                    ...(user?.phone ? { contact: `+91${user.phone}` } : {}),
                },
                config: {
                    display: {
                        blocks: {
                            banks: {
                                instruments: [
                                    { method: "upi" },
                                    { method: "card" },
                                ],
                            },
                        },
                        sequence: ["block.banks"],
                        preferences: { show_default_blocks: false },
                    },
                },
                handler: async function (response: RazorpayPaymentResponse) {
                    const success = await verifyPayment({
                        booking_id,
                        order_id,
                        payment_id: response.razorpay_payment_id,
                    });
                    resolve(success);
                },
                modal: {
                    ondismiss: async function () {
                        const success = await verifyPayment({ booking_id, order_id });
                        resolve(success);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", async function () {
                const success = await verifyPayment({ booking_id, order_id });
                resolve(success);
            });
        });
    };

    return { createPayment };
}