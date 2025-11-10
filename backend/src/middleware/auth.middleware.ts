
import  jwt  from "jsonwebtoken";
import User from "../model/user.model.js";
import type { NextFunction, Request, Response } from "express";

export const protectRoute = async (req: Request, res: Response, next : NextFunction) => {
    try {
        const token = req.cookies.jwt

        if(!token) {
            res.status(401).json({
                success: false,
                message: 'Not authorized - No Token'
            });
            return;
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123') as {userId: string};

        if(!decoded) {
            res.status(401).json({
                success: false,
                message: 'Not autorized - invalid token'
            });
            return;
        }

        const currentUser = await User.findById(decoded.userId);

        req.user = currentUser;

        next();

    } catch (error) {
        console.log('Error while getting user details');
        if( error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Not authorized - Invalid token'
            })
            return;
        } else{
            res.status(500).json({
                success: false,
                message: 'Error in server'
            })
            return;
        }
    }
}