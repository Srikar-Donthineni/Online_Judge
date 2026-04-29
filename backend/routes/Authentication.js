import express from "express";
import {Register,Login,getUser} from "../controllers/Auth.js";


const authRouter = express.Router();
authRouter.post("/register",Register);
authRouter.post("/login",Login);
authRouter.get("/user",getUser);

export default authRouter;