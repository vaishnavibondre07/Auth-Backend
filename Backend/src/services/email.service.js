import SibApiV3Sdk from "sib-api-v3-sdk";
import config from "../config/config.js";

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = config.BREVO_API_KEY;

const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendEmail(to, subject, text = "", html = "") {
    try {
        await transactionalApi.sendTransacEmail({
            sender: {
                email: "vaishnavibondre1234@gmail.com",
                name: "Auth App"
            },
            to: [{ email: to }],
            subject,
            textContent: text,
            htmlContent: html,
        });

        console.log("Email sent successfully");
        return { success: true };

    } catch (error) {
        console.log("Email send failed:", error.message);
        return { success: false, error: error.message };
    }
}

// import { Resend } from "resend";
// import config from "../config/config.js";

// const resend = new Resend(config.RESEND_API_KEY);

// export async function sendEmail(to, subject, text = "", html = "") {
//     try {
//         const { data, error } = await resend.emails.send({
//             from: "onboarding@resend.dev", //  works for any user
//             to,
//             subject,
//             text,
//             html,
//         });

//         if (error) throw new Error(error.message);

//         console.log("Email sent:", data.id);
//         return { success: true, messageId: data.id };

//     } catch (error) {
//         console.log("Email send failed:", error.message);
//         return { success: false, error: error.message };
//     }
// }

// import nodemailer from "nodemailer";
// import config from "../config/config.js";

// // Create transporter
// export const transporter = nodemailer.createTransport({
//     service: "gmail",

//     family : "4",
    
//     auth: {
//         type: "OAuth2",
//         user: config.GOOGLE_USER,
//         clientId: config.GOOGLE_CLIENT_ID,
//         clientSecret: config.GOOGLE_CLIENT_SECRET,
//         refreshToken: config.GOOGLE_REFRESH_TOKEN,
//     },
// });


// //  SAFE VERIFY (NON-BLOCKING)
// transporter.verify()
//     .then(() => {
//         console.log("Email transporter is ready");
//     })
//     .catch((error) => {
//         console.log("Email transporter failed:", error.message);
//     });


// //  SAFE EMAIL FUNCTION
// export async function sendEmail(to, subject, text = "", html = "") {
//     try {
//         const info = await transporter.sendMail({
//             from: config.GOOGLE_USER,
//             to,
//             subject,
//             text,
//             html,
//         });

//         console.log("Email sent:", info.messageId);

//         return {
//             success: true,
//             messageId: info.messageId,
//         };

//     } catch (error) {
//         console.log("Email send failed:", error.message);

//         return {
//             success: false,
//             error: error.message,
//         };
//     }
// }