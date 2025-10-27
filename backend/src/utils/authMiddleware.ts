import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import User from '../model/user.model.js';

interface AuthRequest extends Request {
    user?: any;
}

export const protectRoute = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ error: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret') as { userId: string };

        if (!decoded) {
            return res.status(401).json({ error: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log("Error in protectRoute middleware: ", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
