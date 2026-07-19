import User from "../models/user.model.js";
import { generateAccessToken } from "../utils/jwt.util.js";
import { generateRefreshToken, generateVerificationToken, hashToken } from "../utils/token.util.js";
import { sendVerificationEmail } from "./email.service.js";
import RefreshToken from "../models/refresh-token.model.js";
import env from "../config/env.js";

import  bcrypt  from 'bcrypt';

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

export const loginUser = async(email, password) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password.");
    }
    if (!user.isEmailVerified) {
        throw new Error("User is not verified");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password.");
    }
    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken();
    
    const hashedRefreshToken = hashToken(refreshToken);

    const expiresAt = new Date(
        Date.now() +
        env.REFRESH_TOKEN_EXPIRES_IN_DAYS *
        24 *
        60 *
        60 *
        1000
    );

    await RefreshToken.create({
        user: user._id,
        token: hashedRefreshToken,
        expiresAt,
    });

    return {
        user,
        accessToken,
        refreshToken,
    };
}

export const refreshAccessToken = async(refreshToken) => {
    const hashedRefreshToken = hashToken(refreshToken);
    const refreshTokenDocument = await RefreshToken.findOne({
        token: hashedRefreshToken,
        expiresAt: {
            $gt : new Date()
        }
    }).populate("user");

    if (!refreshTokenDocument) {
        throw new Error("Invalid or expired refresh token.");
    }


    const accessToken = generateAccessToken(refreshTokenDocument.user);
    const newRefreshToken = generateRefreshToken();
    const hashedNewRefreshToken = hashToken(newRefreshToken);

    refreshTokenDocument.token = hashedNewRefreshToken;

    refreshTokenDocument.expiresAt = new Date(
        Date.now() + env.REFRESH_TOKEN_EXPIRES_IN_DAYS
        * 24
        * 60
        * 60
        *1000
    )

    await refreshTokenDocument.save();
    return {
        accessToken,
        newRefreshToken
    }
}