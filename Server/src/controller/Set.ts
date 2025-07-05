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