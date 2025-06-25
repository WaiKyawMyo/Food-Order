import mongoose from "mongoose"

export const connect = async()=>{
    try {
       let DB_Connection = process.env.MONGODB_URL!+'restaurant'
       const dbResponse = await mongoose.connect(DB_Connection )
       console.log("Database is running ", dbResponse.connection.host)
    } catch (error) {
        console.log(error)
    }
}