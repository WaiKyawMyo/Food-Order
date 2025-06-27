import { Request, Response } from 'express';
import fs from 'fs/promises';
import cloudinary from '../utils/cloudinary';
import { Menu } from '../model/food';


export const CreateMenu = async (req: Request, res: Response) => {
  const filePath = req.file?.path;
  const {name,type,price,is_avaliable}=req.body
  if (!filePath) {
     res.status(400).json({ error: 'No file uploaded' });
     return
  }

  try {
    // Upload to Cloudinary
    const result = await  cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
    });

    // Save the URL to MongoDB
    const menu = new Menu({
      name,
      type,
      price,
      is_avaliable,
      image:result.secure_url
    })

    // Delete the file from local storage
    await fs.unlink(filePath);

     res.status(200).json({
      menu,
      message: 'File uploaded and database record created!'
    });

  } catch (error) {
    // Attempt to clean up
    try { await fs.unlink(filePath); } catch {}
   res.status(500).json({ error: 'Upload failed', details: error });
  }
};
