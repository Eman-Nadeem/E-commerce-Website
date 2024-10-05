import mongoose from "mongoose";

export const connect=async()=>{
  try{
    const con=await mongoose.connect(process.env.MONGO_URI)
    console.log(`Database connected successfully, Host:${con.connection.host}`)
  }catch(error){
    console.log('Error connecting to the Database!', error.message)
    process.exit(1)
  }
}