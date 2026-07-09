import mongoose from "mongoose";
import env from "../config/env.js";

const connectDb = async () => {
    try { 
        await mongoose.connect(env.MONGO_URI);
        console.log("MongoDB connected successfully");

    } catch (err) {
        console.log("MomgoDb connection failed");
        console.log(err.message);
        process.exit(1);
    }
    
}
export default connectDb;