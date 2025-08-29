import mongoose, { Schema } from "mongoose";

const tableorderSchema = new Schema({
    time:{
        type:Date,
        required:true
    },
    
    table_id:{
        type:Schema.Types.ObjectId,
        ref:"Table",
        required:true,
        
    },
    
    total: {
        type: Number,
        required: true,
        min: 0
    },
    
    
    status:{
        type:String,
        required: true,
    }


})


export const TableOrder = mongoose.model("TableOrder",tableorderSchema)    

