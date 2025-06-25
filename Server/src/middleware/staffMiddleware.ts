import { NextFunction, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "./authMiddleware";

export const checkAdmin =asyncHandler(async(req:AuthRequest,res:Response,next:NextFunction)=>{
    try {
        if(req.user?.role === "Staff"){
            res.status(401)
            throw new Error('user is not authorized')
        }
        next()
    } catch (error) {
        res.status(401)
        throw new Error('user is not authorized')
    }
})