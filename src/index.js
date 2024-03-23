import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import connectDB from './config/connectDB.js'
import userRoutes from './routes/userRoutes.js'
dotenv.config({
    path:'./.env'
})

const app=express()
const DBURL=process.env.DBURL
const PORT=process.env.PORT || 5000
//cors
app.use(cors())
//database
connectDB(DBURL)
//api 
app.use(express.json())
//routes
app.use('/api/user',userRoutes)
app.listen(PORT,()=>{
    console.log(`Server is running on port:http://localhost:${PORT}`)
})