import mongoose, { Schema } from "mongoose";

const customerOrderSchema = new Schema({
    customer_id:{
        type:Schema.Types.ObjectId,
        ref:"Customer",
        required:true
    },
    tableOrder_id:{
        type:Schema.Types.ObjectId,
        ref:"TableOrder",
        required:true
    }
})

export const CustomerOrder = mongoose.model("CustomerOrder",customerOrderSchema)