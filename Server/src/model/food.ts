import mongoose, { Schema } from "mongoose";

const foodSchema = new Schema ({
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    is_avaliable:{
        type:Boolean,
        required:true
    },
    image:{
        type:String,
        required:true
    }
})

export const Menu= mongoose.model('Menu',foodSchema)