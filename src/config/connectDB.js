import mongoose from "mongoose";

const connectDB=async (DBURL) => {
    try {
        const DBNAME={
            dbname:"authencation"
        }
        await mongoose.connect(DBURL,DBNAME)
        console.log("Database connected successfully")
    } catch (error) {
        console.log(`connection error:${error}`)
    }
}
export default connectDB;