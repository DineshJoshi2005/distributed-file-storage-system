import crypto from "crypto";

export const generateSecureToken = () => {
    return crypto.randomBytes(32).toString("hex");
}

export const generateRefreshToken = () => {
    return crypto.randomBytes(64).toString("hex");
};

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}
