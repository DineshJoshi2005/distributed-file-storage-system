import nodemailer from "nodemailer";
import env from "../config/env.js";

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS
    }
});

export const sendVerificationEmail = async (user, verificationToken) => {
    const verificationUrl = `${env.CLIENT_URL}/verify-email?token=${verificationToken}`


    await transporter.sendMail({
        from: env.SMTP_USER,
        to: user.email,
        subject: "Verify your email",
        html: `
        <h2>Hello ${user.name}</h2>
        <p>
            Please verify your email by clicking the link below.
        </p>
        <a href="${verificationUrl}">
            Verify Email
        </a>
    `
    });

};