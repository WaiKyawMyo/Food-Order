import mongoose, { Schema } from "mongoose";



const CustomerSchema = new Schema ({
    table_id:{
        type:Schema.Types.ObjectId,
        ref:"Table",
        required:true
    },
    total: {
        type:Number,
       default:null
    }
})

export const Customer= mongoose.model('Customer',CustomerSchema)