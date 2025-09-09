import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

const transporter: Transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify((error: Error | null, success: boolean) => {
    if (error) {
        console.error("Mailer connection error:", error);
    }
    else {
        console.log("Mailer is ready to send emails");
    }
});

const sendMail = (mailOptions: SendMailOptions): Promise<any> => {
    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error: Error | null, info: any) => {
            if (error) return reject(error);
            resolve(info);
        });
    });
};

export default sendMail;