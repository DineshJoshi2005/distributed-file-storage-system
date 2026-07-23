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
        <a href="${verificationUrl}" target="_blank" rel="noopener noreferrer">
            Verify Email
        </a>
    `
    });

};

export const sendPasswordResetEmail = async (user, resetToken) => {
    const resetPasswordUrl = `${env.CLIENT_URL}/reset-password?token=${resetToken}`
    await transporter.sendMail({
        from: env.SMTP_USER,
        to: user.email,
        subject: "Reset your password",
        html: `
        <h2>Hello ${user.name}</h2>
        <p>
            Please reset your password by clicking the link below.
        </p>
        <p>This link will expire in 15 minutes.</p>
        <a href="${resetPasswordUrl}" target="_blank" rel="noopener noreferrer">
            Reset Password
        </a>
        `
    })
}
