import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        token: {
            type: String,
            required: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },

        device: {
            type: String,
            default: "Unknown",
        },

        ipAddress: {
            type: String,
            default: "",
        }
    },
    {
        timestamps: true,
    });

refreshTokenSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);
refreshTokenSchema.index({ user: 1 });
const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;