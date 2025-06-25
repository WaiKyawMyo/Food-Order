import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'

interface IAdmin {
    username:string,
    email:string,
    password:string,
    role:string,
    matchPassword(password:string):Promise<boolean>
}

const adminSchema = new Schema<IAdmin> ({
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true,
        uniqued:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    }
})
adminSchema.pre('save',async function (next) {
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password,salt)
})
adminSchema.methods.matchPassword = async function (password:string) {
    return await bcrypt.compare(password,this.password)
}
export const Admin = mongoose.model("Admin",adminSchema)