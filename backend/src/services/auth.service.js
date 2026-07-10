    import User from "../models/user.model.js";

    export const createUser = async (userData) => {
        const { name, email, password } = userData;
        const existingUser = await User.exists({ email });
        if (existingUser) {
            throw new Error("This email is already registered.");
        }
        const newUser = await User.create({
            name,
            email,
            password
        });

        return newUser;
    }