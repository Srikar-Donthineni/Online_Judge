import authRouter from "./routes/Authentication.js"
import problemRouter from "./routes/problemRoutes.js";
import express from 'express';
import DBConnection from "./database/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import code from "./routes/codeRoutes.js";

const app = express();
app.use(cookieParser());
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}))
DBConnection();

app.use("/auth",authRouter);
app.use("/problem",problemRouter);
app.use("/code",code)

app.listen(3000,()=>{
    console.log("Server is listening on Port 3000.")
});