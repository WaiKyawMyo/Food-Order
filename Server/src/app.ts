import express from "express"
import dotenv from "dotenv"
import { connect } from "./db"
import AdminRouter from './router/admin'
import cors from 'cors'
import cookieParser from "cookie-parser"
import { errorHandler } from "./middleware/errorhandler"
import TableRouter from './router/table'
import Food from './router/food'
import Reservation from './router/reservation'
import "./model/user";


dotenv.config({
    path:'.env'
})
const PORT = process.env.PORT
const app = express()
app.use(express.json())
app.use(cors({
    origin:process.env.CLIENT_URL,
    credentials:true
}))
app.use(cookieParser())

app.use('/api',AdminRouter)
app.use('/api',TableRouter)
app.use('/api',Food)
app.use('/api',Reservation)
app.use(errorHandler)

app.listen(PORT,()=>{
     connect()
    console.log("Server is running on "+PORT )
})