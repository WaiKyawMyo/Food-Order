
import { NextFunction, Request, Response } from "express";
import { Admin } from "../model/admin";
import { asyncHandler } from "../utils/asyncHandler";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { Types } from "mongoose";

export interface AuthRequest extends Request{
    user?:{
        username:string,
        email:string,
        _id:string | Types.ObjectId,
        role:string
    }
}
 interface User{
        username:string,
        email:string,
        _id:string| Types.ObjectId,
        role:string
    }

const product =asyncHandler(async(req:AuthRequest,res:Response,next:NextFunction)=>{
    let token= req.cookies.token
    
    if(!token){
       res.status(401)
       throw new Error("user is not authorized")
    }
    try {
        const decoded = jwt.verify(token,process.env.JWT_SECRET!)as JwtPayload
        if(!decoded){
            res.status(401)
            throw new Error('user is not authorized')
        }
        req.user = await Admin.findById(decoded.userId)as User
        next()
    } catch (error) {
        res.status(401)
        throw new Error('user is not authorized')
    }
})
export default product