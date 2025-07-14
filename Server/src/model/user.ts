import mongoose, {  Schema } from "mongoose";


interface IUser {
    username:string,
    email:string,
    password:string,
    role:string,
    phone_no:string
    
}
const userSchema = new Schema <IUser>({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    phone_no:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})

export const User = mongoose.model('User', userSchema);
