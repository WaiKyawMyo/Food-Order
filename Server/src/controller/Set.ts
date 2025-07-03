import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import cloudinary from "../utils/cloudinary";
import { Set } from "../model/Set";
import fs from 'fs/promises';
import { SetMenu } from "../model/SetMenu";

export const CreaetSet = asyncHandler(async(req:Request,res:Response)=>{
    const {name,price ,menu_items}= req.body
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
        const set = await Set.create({
          name,
          price,
          image:result.secure_url,
          cloudinary_id: result.public_id 
        })


    
        // Delete the file from local storage
        await fs.unlink(filePath);

         // Link menu items to the set (if any)
        if (Array.isArray(menu_items) && menu_items.length > 0) {
            for (const item of menu_items) {
                await SetMenu.create({
                    set_id: set._id,
                    menu_id: item.menu_id,
                    unit_Quantity: item.unit_Quantity
                });
            }
        }
    
         res.status(200).json({
          ...set,
          message: 'Success Set Created'
        });
    
      } catch (error) {
        // Attempt to clean up
        try { await fs.unlink(filePath); } catch {}
       res.status(500).json({ message: 'Fail Created', details: error });
      }
})