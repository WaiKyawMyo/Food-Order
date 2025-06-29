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
      image:result.secure_url,
      cloudinary_id: result.public_id 
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
  res.status(200).json(
        getAll
    )
})



export const deleteMenu = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.body
    const data = await Menu.findById(_id)
    if (!_id) {
        res.status(400)
        throw new Error('Menu not found.')
    }
    await Menu.findByIdAndDelete(_id)
    res.status(200).json({ message: "Menu deleted successfully" })
})


export const updateMenu = asyncHandler(async (req: Request, res: Response) => {
  
  const { name, type, price, is_avaliable,_id } = req.body;

  const menu = await Menu.findById(id);
  if (!menu){
    res.status(404).json({ message: "Menu not found" });
  } else{
     // If a new image is uploaded
  if (req.file?.path) {
    // Optional: Delete old image from Cloudinary if you stored public_id
    if (menu?.cloudinary_id) {
      await cloudinary.uploader.destroy(menu.cloudinary_id);
    }
    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, { resource_type: "auto" });
    menu.image = result.secure_url;
    menu.cloudinary_id = result.public_id;
  }

  // Update other fields
  menu.name = name;
  menu.type = type;
  menu.price = price;
  menu.is_avaliable = is_avaliable;

  await menu.save();

  // Cleanup local file if uploaded
  if (req.file?.path) await fs.unlink(req.file.path);

  res.status(200).json({ menu, message: "Menu updated!" });
  }

 
});