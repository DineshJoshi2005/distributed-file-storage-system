import User from "../models/user.model.js";
import { verifyAccessToken } from "../utils/jwt.util.js";

export const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Unauthorized"
        });
    }
    const token = authHeader.split(" ")[1];
    let payload;
    try {
        payload = verifyAccessToken(token);
    } catch (error) {
    return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
    });
    }
    
    const { userId } = payload;
    const user = await User.findById(userId).select("-password");;
    if (!user || !user.isActive) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized"
        })
    }
    req.user = user;
    return next()
}