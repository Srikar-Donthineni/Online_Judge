import authRouter from "./routes/Authentication.js"
import express from 'express';
import DBConnection from "./database/db.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}))
DBConnection();

app.use("/auth",authRouter);

app.listen(3000,()=>{
    console.log("Server is listening on Port 3000.")
});