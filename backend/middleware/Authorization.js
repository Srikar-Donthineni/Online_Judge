import jwt from "jsonwebtoken";

const authorize = (allowedRole)=>{
    return (req,res,next)=>{
        try{
        const user = jwt.decode(req.cookies.token);
        if(allowedRole.includes(user.role)){
            next();
        }
        else{
            res.status(401).send("unauthorized user");
        }}
        catch(error){
            console.log("error in middleware",error)
            res.status(400).send("unauhtorized user");
        }
    }
}


export default authorize;