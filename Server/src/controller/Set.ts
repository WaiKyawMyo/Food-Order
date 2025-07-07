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
      let parsedMenuItems = menu_items;
if (typeof menu_items === "string") {
  try {
    parsedMenuItems = JSON.parse(menu_items);
  } catch {
    parsedMenuItems = [];
  }
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
        if (Array.isArray(parsedMenuItems) && menu_items.length > 0) {
            for (const item of parsedMenuItems) {
                await SetMenu.create({
                    set_id: set._id,
                    menu_id: item._id,
                    unit_Quantity: item.qty
                });
            }
        }else{
          res.status(400).json({message:"Error at Set Data"})
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

export const getAllSet =asyncHandler(async(req:Request,res:Response)=>{
  // Inside your async handler:
const setsWithMenus = await Set.aggregate([
  {
    $lookup: {
      from: "set_menus", // the collection name, lowercased and pluralized by Mongoose
      localField: "_id",
      foreignField: "set_id",
      as: "menus_in_set"
    }
  },
  {
    $unwind: {
      path: "$menus_in_set",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $lookup: {
      from: "menus", // replace with your actual collection name
      localField: "menus_in_set.menu_id",
      foreignField: "_id",
      as: "menu_details"
    }
  },
  {
    $unwind: {
      path: "$menu_details",
      preserveNullAndEmptyArrays: true
    }
  },
  {
    $group: {
      _id: "$_id",
      name: { $first: "$name" },
      price: { $first: "$price" },
      image: { $first: "$image" },
      cloudinary_id: { $first: "$cloudinary_id" },
      menus: {
        $push: {
          menu: "$menu_details",
          unit_Quantity: "$menus_in_set.unit_Quantity"
        }
      }
    }
  }
]);

res.status(200).json(setsWithMenus);
})

export const deleteSet = asyncHandler(async(req:Request,res:Response)=>{
  const {_id}=req.body
  const data = await Set.findById(_id)
      if (!_id || !data) {
          res.status(400)
          throw new Error('Menu not found.')
      }
       if (data.cloudinary_id) {
          await cloudinary.uploader.destroy(data.cloudinary_id);
      }
      await Set.findByIdAndDelete(_id)
      await SetMenu.deleteMany({set_id:_id})
      res.status(200).json({ message:"Set deleted successfully" })
})

export const updaetSet = asyncHandler(async(req:Request,res:Response)=>{
  const {_id,name,price ,menu_items}=req.body
  const filePath = req.file?.path; 
  if(!_id){
    res.status(400).json({message:"Set not found"})
  }
  
  let parsedMenuItems = menu_items;
  if (typeof menu_items === "string") {
    try {
      parsedMenuItems = JSON.parse(menu_items);
    } catch {
      parsedMenuItems = [];
    }
  }
  const menu = await Set.findById(_id);
  if(!menu){
    res.status(404).json({message:"Set not found"})
  }else{
 if (filePath) {
      if (menu.cloudinary_id) {
        await cloudinary.uploader.destroy(menu.cloudinary_id);
      }
      // Upload new image
      const result = await cloudinary.uploader.upload(filePath, {
        resource_type: "auto",
      });
      menu.image = result.secure_url;
      menu.cloudinary_id = result.public_id;
      // Delete local file
      await fs.unlink(filePath);
    }
     // Update other fields
      menu.name = name;
      menu.price = Number(price);

      
  // Remove old SetMenu links
  await SetMenu.deleteMany({ set_id: _id });

  // Add new SetMenu links
  if (Array.isArray(parsedMenuItems) && parsedMenuItems.length > 0) {
    for (const item of parsedMenuItems) {
      await SetMenu.create({
        set_id: _id,
        menu_id: item._id,
        unit_Quantity: item.qty,
      });
    }
  }

  await menu.save();

  res.status(200).json({ menu, message: "Set updated successfully" });

  }

 
})