import { createUser } from "../services/auth.service.js"
import { verifyEmail as verifyEmailService, resendVerificationEmail as resendVerificationEmailService, loginUser, refreshAccessToken as refreshAccessTokenService, logOut as logOutService, logOutAll as logOutAllService } from "../services/auth.service.js";
import env from "../config/env.js";
import { StatusCodes } from "http-status-codes";



export const signUp = async(req,res) => {
    try {
        await createUser(req.body);
        return res.status(201).json({
            success: true,
            message: "User Created Successfully."
        })
    }
    catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        })
    }
}

export const verifyEmail = async (req, res) => {
    try {
        await verifyEmailService(req.body.token);
        return res.status(200).json({
            success: true,
            message: "Email verified successfully."
        });
    }
    catch ( err ) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const resendVerificationEmail = async(req, res) => {
    try {
        await resendVerificationEmailService(req.body.email);
        return res.status(200).json({
            success: true,
            message: "Verification Email sent."
        });
    } catch(err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const login = async(req,res)=>{
    try {
        const { email, password } = req.body;
        const  {
            user,
            accessToken,
            refreshToken,
        } = await loginUser(email, password);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,      
            sameSite: "strict",
            maxAge:
                env.REFRESH_TOKEN_EXPIRES_IN_DAYS *
                24 *
                60 *
                60 *
                1000,
        });
        return res.status(200).json({
            success: true,
            message: "Login successful.",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}

export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                success: false,
                message: "Refresh token is missing.",
            });
        }
        const {
            accessToken,
            newRefreshToken
        } = await refreshAccessTokenService(refreshToken);
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge:
                env.REFRESH_TOKEN_EXPIRES_IN_DAYS *
                24 *
                60 *
                60 *
                1000,
        });
        return res.status(200).json({
            success: true,
            message: "New Access Token Generated.",
            accessToken,
            
        });
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
}

export const getCurrentUser = (req, res) => {
    return res.status(200).json({
        user: req.user
    })
}

export const logOut = async (req,res)=>{
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        await logOutService(refreshToken);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(200).json({
            success: true,
            message: "Logout Successfully."
        })
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
}

export const logOutAllDevices = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            })
        }
        await logOutAllService(userId);
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return res.status(200).json({
            success: true,
            message: "Logged out from all devices."
        });
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }
}