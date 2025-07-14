import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Reservation } from "../model/reservation";
import { User } from "../model/user";        // Import User model first
import { Table } from "../model/tabel";



export const myReservationGet =asyncHandler(async(req:Request,res:Response)=>{

  const reservations = await Reservation.find().populate('table_id').populate('user_id')
   if (!reservations.length) {
     res.status(200).json({ message: "There is no Reservation" });
  }else{
    res.status(200).json(reservations);
  }
  
})