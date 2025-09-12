import axios from "axios";

const MSG91_BASE_URL = "https://control.msg91.com/api/v5/otp";
const AUTH_KEY = process.env.MSG91_AUTH_KEY || "";
const TEMPLATE_ID = process.env.MSG91_TEMPLATE_ID || "";

interface OTPResponse {
    type: string;
    [key: string]: any;
}

export async function requestOtp(mobile: string): Promise<OTPResponse> {
    try {
        const { data } = await axios.request<OTPResponse>({
            method: "POST",
            url: MSG91_BASE_URL,
            params: {
                template_id: TEMPLATE_ID,
                mobile: Number(mobile),
                authkey: AUTH_KEY
            },
            headers: {
                "content-type": "application/json",
                "Content-Type": "application/JSON"
            },
        });

        return data;
    }
    catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to send OTP");
    }
}

export async function confirmOtp(
    mobile: string,
    otp: string
): Promise<OTPResponse> {
    try {
        const { data } = await axios.request<OTPResponse>({
            method: "GET",
            url: `${MSG91_BASE_URL}/verify`,
            params: { otp, mobile },
            headers: { authkey: AUTH_KEY },
        });

        return data;
    }
    catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to verify OTP");
    }
}

const MSG91_WHATSAPP_URL = "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/";
const INTEGRATED_NUMBER = process.env.MSG91_INTEGRATED_NUMBER || "";
const TEMPLATE_NAMESPACE = process.env.MSG91_TEMPLATE_NAMESPACE || "";

interface WhatsAppResponse {
    [key: string]: any;
}

interface WhatsAppComponent {
    [key: string]: {
        type: string;
        value: string;
    };
}

export async function sendWhatsAppMessage(
    templateName: string,
    phone: string,
    components: WhatsAppComponent
): Promise<WhatsAppResponse> {
    try {
        const requestBody = {
            integrated_number: INTEGRATED_NUMBER,
            content_type: "template",
            payload: {
                messaging_product: "whatsapp",
                type: "template",
                template: {
                    name: templateName,
                    language: {
                        code: "en_US",
                        policy: "deterministic",
                    },
                    namespace: TEMPLATE_NAMESPACE,
                    to_and_components: [
                        {
                            to: [`91${phone}`],
                            components,
                        },
                    ],
                },
            },
        };

        const { data } = await axios.post(MSG91_WHATSAPP_URL, requestBody, {
            headers: {
                "Content-Type": "application/json",
                authkey: AUTH_KEY,
            },
        });

        return data;
    }
    catch (error: any) {
        throw new Error(error.response?.data?.message || "Failed to verify OTP");
    }
}