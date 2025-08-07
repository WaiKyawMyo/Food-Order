import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Table } from "../model/tabel";
import { AuthRequest } from "../middleware/authMiddleware";


export const addTable = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { table_No, capacity, is_reserved, status } = req.body

    const existingTable = await Table.findOne({ table_No })
    if (existingTable) {
        res.status(409)
        throw new Error('A table with this table number already exists.')
    }
    const table = await Table.create({
        table_No,
        capacity,

        status,
        admin_id: req.user?._id
    })
    if (table) {
        res.status(200).json({
            _id: table._id,
            table_No: table.table_No,
            capacity: table.capacity,
            help:false,
            status: table.status,
            admin_id: table.admin_id
        })
    }

})

export const getAllTable = asyncHandler(async (req: Request, res: Response) => {
    const Alltable = await Table.find()
    res.status(200).json(Alltable)
})

export const deletTable = asyncHandler(async (req: Request, res: Response) => {
    const { _id } = req.body
    const data = await Table.findById(_id)
    if (!_id) {
        res.status(400)
        throw new Error('Table not found.')
    }

    if (!data) {
        res.status(404)
        throw new Error('Table not found')
    }
    await Table.findByIdAndDelete(_id)
    res.status(200).json({ message: "Table deleted successfully" })
})

export const updateTable = asyncHandler(async (req: Request, res: Response) => {
    const { _id, table_No, capacity,status } = req.body
    const exitTable = await Table.findById({ _id })
    const TableNoCheck = await Table.findOne({ table_No })
    if (!_id) {
        res.status(404)
        throw new Error('Table not found')
    }
    if (!exitTable) {
        res.status(404)
        throw new Error('Table not found')
    }

    exitTable.table_No = table_No,
        exitTable.capacity = capacity
    exitTable.status = status

    if (TableNoCheck) {
        if (TableNoCheck._id == _id) {
            const resTB = await exitTable.save()
            res.status(200).json({ message: "Success Update", resTB })
        }else{
            res.status(409).json({message:"A table with this table number already exists."})
        }
    }else{
        const resTB = await exitTable.save()
        res.status(200).json({ message: "Success Update", resTB })
    }
    
})