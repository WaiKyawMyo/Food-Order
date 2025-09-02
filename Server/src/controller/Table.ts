import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { Table } from "../model/tabel";
import { AuthRequest } from "../middleware/authMiddleware";
import { Customer } from "../model/Customer";
import mongoose from "mongoose";
import { TableOrder } from "../model/TableOrder";


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
        help:false,
        code:null,
        status,
        admin_id: req.user?._id
    })
    if (table) {
        res.status(200).json({
            _id: table._id,
            table_No: table.table_No,
            capacity: table.capacity,
           
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
    const { _id, table_No, capacity } = req.body
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

export const show_order = asyncHandler(async(req, res) => {
    const { table_id } = req.body;
    
    if (!table_id) {
        throw new Error("Table ID is required");
    }

    const result = await Customer.aggregate([
        // Match customer by table_id
        { $match: { table_id: new mongoose.Types.ObjectId(table_id) } },
        { $sort: { time: -1 } },
        { $limit: 1 },
        
        // Lookup customer orders
        {
            $lookup: {
                from: 'customerorders',
                localField: '_id',
                foreignField: 'customer_id',
                as: 'customerOrders'
            }
        },
        
        // Lookup table orders
        {
            $lookup: {
                from: 'tableorders',
                localField: 'customerOrders.tableOrder_id',
                foreignField: '_id',
                as: 'tableOrders'
            }
        },
        
        // Lookup order menu items
        {
            $lookup: {
                from: 'ordermenus',
                let: { orderIds: '$tableOrders._id' },
                pipeline: [
                    { $match: { $expr: { $in: ['$order_id', '$$orderIds'] } } },
                    // Lookup menu details
                    {
                        $lookup: {
                            from: 'menus',
                            localField: 'menu_id',
                            foreignField: '_id',
                            as: 'menuDetails'
                        }
                    },
                    // Lookup set details
                    {
                        $lookup: {
                            from: 'sets',
                            localField: 'set_id',
                            foreignField: '_id',
                            as: 'setDetails'
                        }
                    }
                ],
                as: 'orderItems'
            }
        }
    ]);

    if (!result.length) {
         res.status(404).json({
            success: false,
            message: "No customer found for this table"
        });
    }

    res.status(200).json({
        success: true,
        data: result[0]
    });
});

export const showAllOrders = asyncHandler(async(req, res) => {
    
        const orders = await TableOrder.aggregate([
            {
                $lookup: {
                    from: 'tables',
                    localField: 'table_id',
                    foreignField: '_id',
                    as: 'table'
                }
            },
            {
                $lookup: {
                    from: 'ordermenus',
                    localField: '_id',
                    foreignField: 'order_id',
                    as: 'orderItems',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'menus',
                                localField: 'menu_id',
                                foreignField: '_id',
                                as: 'menu'
                            }
                        },
                        {
                            $lookup: {
                                from: 'sets',
                                localField: 'set_id',
                                foreignField: '_id',
                                as: 'set'
                            }
                        },
                        {
                            $addFields: {
                                menu: { $arrayElemAt: ['$menu', 0] },
                                set: { $arrayElemAt: ['$set', 0] }
                            }
                        }
                    ]
                }
            },
            {
                $unwind: '$table'
            },
            {
                $addFields: {
                    itemCount: { $size: '$orderItems' }
                }
            },
            {
                $sort: { time: -1 }
            },
            {
                $project: {
                    time: 1,
                    total: 1,
                    status: 1,
                    table: '$table',
                    items: '$orderItems',
                    itemCount: 1
                }
            }
        ]);
        
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
        
    
});

export const conpleteOrder = asyncHandler(async(req, res) => {
    const { _id } = req.body;
    
    if(!_id){
        res.status(404).json({message:"There is no id!"})
    }
    const tableOrder = await TableOrder.findById(_id);
    if (!tableOrder) {
         res.status(404).json({ message: "Order not found" })
    } else {
        tableOrder.status = "completed";
        await tableOrder.save();
        res.status(200).json({ message: "Order marked as completed successfully", data: tableOrder });
    }
});

export const getTablesNeedingHelp = asyncHandler(async (req, res) => {
    const tablesNeedingHelp = await Table.find({ 
        help: true 
    }).sort({ updatedAt: -1 }); // Most recent help requests first
    
    res.status(200).json({
        success: true,
        count: tablesNeedingHelp.length,
        data: tablesNeedingHelp
    });
});

export const resolveTableHelp = asyncHandler(async (req, res) => {
    const { tableId } = req.params;
    
    const table = await Table.findByIdAndUpdate(
        tableId,
        { help: false },
       
    );
    
    if (!table) {
         res.status(404).json({ 
            success: false,
            message: "Table not found" 
        });
    }
    
    res.status(200).json({
        success: true,
        message: "Help request resolved successfully",
        data: table
    });
});