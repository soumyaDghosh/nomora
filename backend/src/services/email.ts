import * as nodemailer from "nodemailer";
import * as fs from "fs";
import * as path from "path";
import * as handlebars from "handlebars";
import { BookingConfirmationTemplateData, BookingEmailData } from "../types/booking";

const smtpHost = process.env.SMTP_HOST || "smtp.resend.com";
const smtpPort = Number(process.env.SMTP_PORT || 587);
const smtpUser = process.env.SMTP_USER || "";
const smtpPass = process.env.SMTP_PASS || "";

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
        user: smtpUser,
        pass: smtpPass,
    },
});

if (!smtpUser || !smtpPass) {
    console.warn("SMTP credentials not configured. Email functionality will be limited.");
}

if (!handlebars.helpers["format-booking-date"]) {
    handlebars.registerHelper("format-booking-date", (dateStr: string) => {
        try {
            if (!dateStr) return "";
            const date = new Date(dateStr);
            return date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return dateStr;
        }
    });
}

let compiledTemplate: HandlebarsTemplateDelegate | null = null;

async function loadAndCacheTemplate(): Promise<void> {
    const templatePath = path.join(__dirname, "..", "templates", "booking-confirmation.html");
    const templateContent = await fs.promises.readFile(templatePath, "utf-8");

    if (!templateContent || templateContent.trim() === "") {
        throw new Error("Template content is empty");
    }

    compiledTemplate = handlebars.compile(templateContent);
}

loadAndCacheTemplate().catch(error => {
    console.error("Failed to load email template at startup:", error);
    process.exit(1);
});

export async function sendBookingConfirmationEmail(emailData: BookingEmailData): Promise<void> {
    try {
        // Wait for template to be loaded if not ready yet
        if (!compiledTemplate) {
            await loadAndCacheTemplate();
        }

        const templateData: BookingConfirmationTemplateData = {
            ...emailData,
            bookingDate: emailData.date,
            time: emailData.time,
            ...(emailData.listingId && { listingId: emailData.listingId }),
            ...(emailData.transferType && { transferType: emailData.transferType }),
            ...(emailData.terminal && { terminal: emailData.terminal }),
            ...(emailData.guestCount && emailData.guestCount > 0 && { guestCount: emailData.guestCount }),
        };

        const htmlContent = compiledTemplate!(templateData);

        // TODO: Don't hardcode the email ids
        await transporter.sendMail({
            from: "Nomora <care@nomora.co.in>",
            to: "care@nomora.co.in",
            subject: `New Booking - ${emailData.hotelName}`,
            html: htmlContent,
        });

    } catch (error) {
        console.error("Failed to send booking confirmation email:", error);
        throw new Error("Failed to send email");
    }
}
