import { Request, Response } from 'express';
import fs from 'fs/promises';
import cloudinary from '../utils/cloudinary';
import { Menu } from '../model/food';
import { asyncHandler } from '../utils/asyncHandler';


export const CreateMenu = asyncHandler(async (req: Request, res: Response) => {
  const filePath = req.file?.path;
  const {name,type,price,is_avaliable}=req.body
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
    const menu = await Menu.create({
      name,
      type,
      price,
      is_avaliable,
      image:result.secure_url
    })

    // Delete the file from local storage
    await fs.unlink(filePath);

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

export const getAllMenu = asyncHandler(async(req:Request,res:Response)=>{
  const getAll = await Menu.find()
})