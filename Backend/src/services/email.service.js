import nodemailer from "nodemailer";
import config from "../config/config.js";

// Create transporter
export const transporter = nodemailer.createTransport({
    service: "gmail",

    family : "4",
    
    auth: {
        type: "OAuth2",
        user: config.GOOGLE_USER,
        clientId: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        refreshToken: config.GOOGLE_REFRESH_TOKEN,
    },
});


//  SAFE VERIFY (NON-BLOCKING)
transporter.verify()
    .then(() => {
        console.log("Email transporter is ready");
    })
    .catch((error) => {
        console.log("Email transporter failed:", error.message);
    });


//  SAFE EMAIL FUNCTION
export async function sendEmail(to, subject, text = "", html = "") {
    try {
        const info = await transporter.sendMail({
            from: config.GOOGLE_USER,
            to,
            subject,
            text,
            html,
        });

        console.log("Email sent:", info.messageId);

        return {
            success: true,
            messageId: info.messageId,
        };

    } catch (error) {
        console.log("Email send failed:", error.message);

        return {
            success: false,
            error: error.message,
        };
    }
}