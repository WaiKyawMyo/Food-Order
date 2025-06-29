import { Request, Response } from "express";
import { Admin } from "../model/admin";
import { generateToken } from "../utils/generateToken";
import { asyncHandler } from "../utils/asyncHandler";
import { AuthRequest } from "../middleware/authMiddleware";

export const regiterAdmin = asyncHandler(async(req:Request,res:Response)=>{
    const {username,email,password}= req.body
    const existingAdmin = await Admin.findOne({email})
    if(existingAdmin){
        res.status(400)
        throw new Error('Email is already exists.')
    }
    const admin = await Admin.create({
        username,
        email,
        password,
        role: "Admin"
    })
    if(admin){
        res.status(200).json({
            _id:admin._id,
            username:admin.username,
            email:admin.email,
            role:admin.role
        })
    }
})

export const AdminStaffRegister = asyncHandler(async(req:AuthRequest,res:Response)=>{
    const existingAdmin =await Admin.findById(req.user?._id)
    if(!existingAdmin ){
        res.status(400)
        throw new Error('User not found')
    }
    const {email,password,username} = req.body
    
    const existingEmail = await Admin.findOne({email})
    if (existingEmail){
        res.status(400)
        throw new Error('Email is already exist')
    }
    const staff = await Admin.create({
        username,
        email,
        password,
        role: "Staff"
    })
    if(staff){
        res.status(200).json({
            _id:staff._id,
            username:staff.username,
            email:staff.email,
            role:staff.role
        })
    }
    
})

export const adminLogin =asyncHandler( async(req:Request,res:Response)=>{
    const {email,password} =req.body
    if(!email || !password){
        res.status(400).json("Need Email or Password")
    }
    const existingAdmin = await Admin.findOne({email})
    if(existingAdmin && (await existingAdmin.matchPassword(password))){
        generateToken(res,existingAdmin._id)
        res.status(200).json({
            _id:existingAdmin._id,
            username:existingAdmin.username,
            email:existingAdmin.email,
            role:existingAdmin.role
        })
    }else{
        res.status(400).json({message:"Invalid credentials"})
    }


})

export const adminLogout = asyncHandler(async(req:Request,res:Response)=>{
    res.cookie("token",'',{
        httpOnly:true,
        expires:new Date(0)
    })
    res.status(200).json({message:"User logour Successful"})
})

export const getAdminProfile=asyncHandler(async(req:AuthRequest,res:Response)=>{
    const user = {
        _id:req.user?._id,
        username:req.user?.username,
        email:req.user?.email,
        role:req.user?.role
    }
    res.status(200).json({user})
})

export const updateAdminProfile= asyncHandler(async(req:AuthRequest,res:Response)=>{
    const admin = await Admin.findById(req.user?._id)
    if(!admin){
        res.status(404)
        throw new Error('User not found')
    }
    admin.username = req.body.username || admin.username
    admin.email =req.body.email || admin.email
    admin.password =req.body.password || admin.password

    const response = await admin.save()
    const selecteduser ={
        _id:response._id,
        username:response.username,
        email:response.email,
        role:response.role
    }
    res.status(200).json(selecteduser)
})

export const getAllAdmin = asyncHandler(async (req: Request, res: Response) => {
    const Alltable = await Admin.find()
        
    res.status(200).json(
        Alltable
    )
})
export const deletAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.body
    const data = await Admin.findById(_id)
    if (!_id) {
        res.status(400)
        throw new Error('Table not found.')
    }

    await Admin.findByIdAndDelete(_id)
    res.status(200).json({ message: "Admin deleted successfully" })
})
export const updateAdmin = asyncHandler(async (req: Request, res: Response) => {
    const { _id, username, email,password } = req.body
    const exitAdmin = await Admin.findById({ _id })
    const AdminEmailCheck = await Admin.findOne({ email })
    if (!_id) {
        res.status(404)
        throw new Error('Admin not found')
    }
    if (!exitAdmin) {
        res.status(404)
        throw new Error('Admin not found')
    }

    exitAdmin.username = username,
        exitAdmin.email = email,
        exitAdmin.password = password || exitAdmin.password

    if (AdminEmailCheck) {
        if (AdminEmailCheck._id == _id) {
            const resTB = await exitAdmin.save()
            res.status(200).json({ message: "Success Update", resTB })
        }else{
            res.status(409).json({message:"Email is already exist"})
        }
    }else{
        const resTB = await exitAdmin.save()
        res.status(200).json({ message: "Success Update", resTB })
    }
    
})