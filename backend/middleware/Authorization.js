import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const authorize = (allowedRole)=>{
    return (req,res,next)=>{
        console.log("reached middleware authorization")
        try{
        const user = jwt.decode(req.cookies.token);
        if(allowedRole.includes(user.role)){
            console.log("going to next part");
            next();
        }
        else{
            res.status(401).send("unauthorized user");
        }}
        catch(error){
            res.status(400).send("unauhtorized user");
        }
    }
}

export const aiLimit = ()=>{
    console.log("reached ai limiter middleware")
    return async (req,res,next)=>{
        
        try{
        const user = jwt.decode(req.cookies.token);
            const users = await User.findOne({ email: user.email});
            const requests = users.airequests;
            if(requests>=5){
                res.status(429).json({message : "exceeded usage limit"})
            }
            else
            {  
                next();
            }
    }
    catch(error){
        console.log(error);
        res.status(400).send({message:"unable to implement ai requests limit"})
    }
    }
}

