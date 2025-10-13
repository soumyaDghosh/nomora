import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail(options: EmailOptions) {
    try {
        const mailOptions = {
            from: '"Nomora" <care@nomora.co.in>',
            ...options,
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Failed to send email:", error);
        throw new Error("Failed to send email");
    }
}
