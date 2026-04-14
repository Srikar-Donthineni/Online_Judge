import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DBConnection = async ()=>{
    const MONGODB_URL = process.env.MONGODB_URL;
    try{
        await mongoose.connect(MONGODB_URL);
        console.log("MongoDb connected");
    }
    catch(error){
     console.log("Error connecting to the database");
    }
};

export default DBConnection;