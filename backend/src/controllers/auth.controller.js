import { createUser } from "../services/auth.service.js"
import { verifyEmail as verifyEmailService, resendVerificationEmail as resendVerificationEmailService , loginUser} from "../services/auth.service.js";
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
        const user = await loginUser(email, password);
        return res.status(200).json({
            success: true,
            message: "Login Successfull."
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
}