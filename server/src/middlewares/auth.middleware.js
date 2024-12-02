import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
}; 