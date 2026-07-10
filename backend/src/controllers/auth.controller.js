import { createUser } from "../services/auth.service.js"

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