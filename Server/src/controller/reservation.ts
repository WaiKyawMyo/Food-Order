import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Reservation } from "../model/reservation";
import { User } from "../model/user";        // Import User model first
import { Table } from "../model/tabel";
import { Order } from "../model/Order";
import { OrderMenu } from "../model/Order_Menu";
import { Discount } from "../model/discount";
import { Customer } from "../model/Customer";




export const myReservationGet =asyncHandler(async(req:Request,res:Response)=>{

  const reservations = await Reservation.find().populate('table_id').populate('user_id')
   if (!reservations.length) {
     res.status(200).json({ message: "There is no Reservation" });
  }else{
    res.status(200).json(reservations);
  }
})

export const detailReservation = asyncHandler(async(req: Request, res: Response) => {
    const { id } = req.params;  // Get from params, not body

    if (!id) {
         res.status(400).json({
            success: false,
            message: "Reservation ID is required"
        });
    }

    const orders = await Order.findOne({ reservation_id: id })
        .populate('reservation_id')
        .populate('table_id')
        .populate('user_id');

    if (!orders) {
         res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }else{
       const orderMenuItems = await OrderMenu.find({ order_id: orders._id })
        .populate('menu_id')
        .populate('set_id');

     res.status(200).json({
        success: true,
        data: {
            order: orders,
            items: orderMenuItems
        }
    }); 
    }

    
});

export const createDiscount= asyncHandler(async(req,res)=>{
    const {name,persent}= req.body
    const existingDiscount = await Discount.find()
    if(existingDiscount.length){
        
        const update = existingDiscount[0]
        update.name = name
        update.persent = persent
        update.status = true
       const updateData= await update.save()
       res.status(201).json({updateData,message:"Update Discount is Success"})
    }else{
        const newRes = await Discount.create({
            name,
            persent,
            status: true
        })
        res.status(200).json({message:"Create Success",newRes})
    }

})

export const getDiscount = asyncHandler(async(req,res)=>{
    const response = await Discount.find()
    res.status(200).json({response,message:"Success get discount"})
} )

export const getAllTable = asyncHandler(async(req,res)=>{
    const response = await Table.find()
    const AllData = []
    
    // Use for...of loop instead of map() for async operations
    for(const table of response) {
        const reservationData = await Reservation.findOne({table_id: table._id})
        if(reservationData){
            AllData.push({table, reservationData})
        } else {
            AllData.push({table})
        }
    }
    
    if(AllData.length){
        res.status(200).json({data:AllData, message:"Success"})
    } else {
        res.status(404).json({message: "No tables found"})
    }
})

export const updatetable = asyncHandler(async(req,res)=>{
    const {_id,status,code}= req.body
    if(!_id){
        res.status(400)
        throw new Error('Table not found.')
    }
    const table = await Table.findById({_id})
    if(!table){
        res.status(404)
        throw new Error("Table is not found")
    }
    table.status= status
    table.code =code
    await table.save()
    
    res.status(201).json({message:`Table ${table.table_No} is ${table.status}`})
})

export const CreateCustomer = asyncHandler(async(req,res)=>{
    const {table_id}= req.body
    const newRes = await Customer.create({
    table_id
    
        })
        res.status(200).json({message:"Create Success",newRes})
})