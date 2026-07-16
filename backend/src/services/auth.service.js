import User from "../models/user.model.js";
import { generateVerificationToken, hashToken } from "../utils/token.util.js";
import { sendVerificationEmail } from "./email.service.js";

    export const createUser = async (userData) => {
        const { name, email, password } = userData;
        const existingUser = await User.exists({ email });
        if (existingUser) {
            throw new Error("This email is already registered.");
        }

        const verificationToken = generateVerificationToken();
        const hashedVerificationToken = hashToken(verificationToken);
        const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

        const user = await User.create({
            name,
            email,
            password,
            verificationToken: hashedVerificationToken,
            verificationTokenExpires,
        });

        await sendVerificationEmail(user, verificationToken);

        return user;
}
    
    export const verifyEmail = async (token) => {
        const hashedToken = hashToken(token);
        const user = await User.findOne({
            verificationToken: hashedToken,
            verificationTokenExpires: {
                $gt: new Date()
            }
        })

        if (!user) {
            throw new Error("Invalid or expired verification token");
        }

        user.isEmailVerified = true;
        user.verificationToken = null;
        user.verificationTokenExpires = null;

        await user.save();
        
        return user;
}
    
export const resendVerificationEmail = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User doesn't exist.");
    }
    if (user.isEmailVerified) {
        throw new Error("User is already verified");
    }
    const verificationToken = generateVerificationToken();
    const hashedVerificationToken = hashToken(verificationToken);
    const verificationTokenExpires = new Date(Date.now() + 15 * 60 * 1000);

    user.verificationToken = hashedVerificationToken;
    user.verificationTokenExpires = verificationTokenExpires;

    await user.save();

    await sendVerificationEmail(user, verificationToken);

    return user;
}