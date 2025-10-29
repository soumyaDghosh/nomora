import useVerifyPayment from "./useVerifyPayment";
import useAuthStore from "../store/authStore";
import type { RazorpayPaymentResponse } from "../global";

interface CreatePaymentProps {
    environment?: string,
    booking_id: string,
    order_id: string,
    order_amount: number
}

export default function useCreatePayment() {
    const { verifyPayment } = useVerifyPayment();

    const { user } = useAuthStore();

    const createPayment = async ({ environment, booking_id, order_id, order_amount }: CreatePaymentProps): Promise<boolean> => {
        // TODO: In production payment was not asked for.
        // if (environment === "production") {
        //     const success = await verifyPayment({
        //         environment,
        //         booking_id,
        //         order_id
        //     });
        //     return success;
        // }

        return new Promise((resolve) => {
            let failed = false;

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
                            upi: {
                                name: "UPI",
                                instruments: [
                                    {
                                        method: "upi"
                                    },
                                ],
                            },
                            debit: {
                                name: "Debit Card",
                                instruments: [
                                    {
                                        method: "card",
                                        types: ["debit"]
                                    },
                                ],
                            },
                            credit: {
                                name: "Credit Card",
                                instruments: [
                                    {
                                        method: "card",
                                        types: ["credit"]
                                    },
                                ],
                            },
                        },
                        sequence: ["block.upi", "block.debit", "block.credit"],
                        preferences: { show_default_blocks: false },
                    },
                },
                handler: async function (response: RazorpayPaymentResponse) {
                    if (failed) return resolve(false);
                    const success = await verifyPayment({
                        booking_id,
                        order_id,
                        payment_id: response.razorpay_payment_id,
                    });
                    resolve(success);
                },
                modal: {
                    ondismiss: async function () {
                        if (failed) return resolve(false);
                        const success = await verifyPayment({ booking_id, order_id });
                        resolve(success);
                    },
                },
                retry: {
                    enabled: false,
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

            rzp.on("payment.failed", async function handler(response) {
                failed = true;
                rzp.off("payment.failed", handler);
                verifyPayment({
                    booking_id,
                    order_id,
                    ...(response?.error?.metadata?.payment_id
                        ? { payment_id: response.error.metadata.payment_id }
                        : {}),
                });
            });
        });
    };

    return { createPayment };
}
