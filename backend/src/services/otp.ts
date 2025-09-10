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
                // realTimeResponse: 1
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