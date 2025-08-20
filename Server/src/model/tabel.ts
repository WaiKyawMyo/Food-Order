import mongoose, { Schema } from "mongoose";

interface ITable {
    table_No:number,
    capacity:number,
    is_reserved:boolean,
    status:string,
    help:boolean,
    code:number | null,
    admin_id:mongoose.Types.ObjectId
}

const tableSchema =new Schema<ITable> ({
    table_No:{
        type:Number,
        required:true
    },
    capacity:{
        type:Number,
        required:true
    },
    is_reserved:{
        type:Boolean,
        d:true
    },
    status:{
        type:String,
        required:true
    },
    help:{
        type:Boolean,
        required:true    
    },
    code:{
        type:Number, 
        default: null  
    },
    admin_id:{
        type:Schema.Types.ObjectId,
        ref:"Admin",
        required:true
    }
})

export const Table= mongoose.model("Table",tableSchema)