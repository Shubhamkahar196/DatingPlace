import type { Request,Response } from "express";
import User from "../model/user.model.js";
import jwt from 'jsonwebtoken'
import { SignupSchema } from "../utils/auth.js";


export const signup = async(req:Request, res:Response) =>{
    try {
        
        const parsedData = SignupSchema.safeParse(req.body);
        if(!parsedData){
            throw new Error("")
        }
    } catch (error) {
        
    }
}