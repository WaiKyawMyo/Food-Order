import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import cloudinary from "../utils/cloudinary";
import { Set } from "../model/Set";
import fs from 'fs/promises';
import { SetMenu } from "../model/SetMenu";

const CreaetSet = asyncHandler(async(req:Request,res:Response)=>{
    const {name , set_id}= req.body
    const filePath = req.file?.path;

     if (!filePath) {
         res.status(400).json({ message: 'No file uploaded' });
         return
      }
    
      try {
        // Upload to Cloudinary
        const result = await  cloudinary.uploader.upload(filePath, {
          resource_type: "auto",
        });
    
        // Save the URL to MongoDB
        const menu = await Set.create({
          name,
          image:result.secure_url,
          cloudinary_id: result.public_id 
        })
    
        // Delete the file from local storage
        await fs.unlink(filePath);
        await SetMenu.create({
            
        })
    
         res.status(200).json({
          ...menu,
          message: 'Success Menu Create'
        });
    
      } catch (error) {
        // Attempt to clean up
        try { await fs.unlink(filePath); } catch {}
       res.status(500).json({ message: 'Fail Create', details: error });
      }
})