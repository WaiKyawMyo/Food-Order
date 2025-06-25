import { NextFunction, Request, Response } from "express";

export const errorHandler = (err:Error,req:Request,res:Response,next:NextFunction)=>{
    const statuseCode= res.statusCode===200?500:res.statusCode
    res.status(statuseCode).json({
        message:err.message ,
        stack: process.env.NODE_ENV ? null : err.stack 
    },
    )
}