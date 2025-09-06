import twilio, { Twilio } from "twilio";

const accountSid: string = process.env.TWILIO_ACCOUNT_SID as string;
const authToken: string = process.env.TWILIO_AUTH_TOKEN as string;
const verifySid: string = process.env.TWILIO_VERIFY_SID as string;

const client: Twilio = twilio(accountSid, authToken);

export async function createVerification(phone: string) {
    const verification = await client.verify.v2
        .services(verifySid)
        .verifications.create({
            channel: "sms",
            to: `+91${phone}`,
        });
    return verification;
}

export async function createVerificationCheck(otp: string, phone: string) {
    const verificationCheck = await client.verify.v2
        .services(verifySid)
        .verificationChecks.create({
            code: otp,
            to: `+91${phone}`,
        });
    return verificationCheck;
}

export async function sendSMS(to: string, message: string) {
    try {
        const result = await client.messages.create({
            to,
            body: message,
        });
        return result;
    }
    catch (error) {
        throw error;
    }
}