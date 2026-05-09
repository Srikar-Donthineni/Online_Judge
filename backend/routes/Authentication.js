import express from "express";
import {Register,Login,getUser,Logout} from "../controllers/Auth.js";


const authRouter = express.Router();
authRouter.post("/register",Register);
authRouter.post("/login",Login);
authRouter.get("/user",getUser);
authRouter.post("/logout",Logout)

export default authRouter;