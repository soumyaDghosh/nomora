export { };

declare global {
    interface Window {
        __lastPagePath?: string;
        dataLayer: DataLayerEvent[];
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

type DataLayerEvent = {
    event: string;
    page_path: string;
    page_title?: string;
};

export interface RazorpayPaymentResponse {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name?: string;
    description?: string;
    order_id?: string;
    handler?: (response: RazorpayPaymentResponse) => void;
    prefill?: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme?: {
        color?: string;
    };
}

interface RazorpayInstance {
    open(): void;
    on(event: string, callback: (response: RazorpayPaymentResponse) => void): void;
    close(): void;
}