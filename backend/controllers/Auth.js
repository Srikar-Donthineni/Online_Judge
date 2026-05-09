import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req,res)=>{
    const {firstname,lastname,email,password} = req.body;
    if(!(firstname && lastname && email && password)){
        return res.status(400).send({message:"Please enter all four values"});
    }
    const existUseremail = await User.findOne({ email: req.body.email});
    if (existUseremail) {
        return res.status(400).send({message:"User already exists"});
    }
    const hashedPassword = bcrypt.hashSync(password,10);
    const newUser = new User({ 
        firstname,
        lastname,
        email,
        password:hashedPassword,
        });
    await newUser.save();
    
    const userObj = newUser.toObject();
    userObj.password = null;

    return res.status(200).json({
        message : "User successfully created",
        user:userObj
    });
}

//login
//get the login data
//check email exists , if email user is registered , if not ask him to register
//retrieve the hashed password for that email
//copare that hashed password , with the password provided
//if matches send a jwt token , else send incorrect password message

export const Login = async (req,res)=>{
    const existUseremail = await User.findOne({ email: req.body.email});
    if(!existUseremail){
        return res.status(400).send("User doesn't exists");
    }
    else{
        const user = existUseremail.toObject();
        if(await bcrypt.compare(req.body.password,user.password)){
            const jwtSecretKey = process.env.JWT_SECRET_KEY;
            const token = jwt.sign({email:user.email,role:user.role}, jwtSecretKey,{expiresIn:'2h'});
            user.password= null;
              res.cookie('token', token, {
                httpOnly: true,   
                secure: false,     
                sameSite: 'lax', 
                maxAge: 24 * 60 * 60 * 1000 
            });
            return res.status(200).json({
                message:"user logged in successfully",
                user
            })
        }
        else{
            return res.status(400).send("Incorrect password");
        }
    }
}

export const Logout = (req,res)=>{
    try{
        res.clearCookie('token');
        res.status(200).json({message:"Cleared Successfully"})
    }
    catch(error){
        console.log("error clearing cookie");
        res.status(400).send("unable to clear cookie")
    }
}

export const getUser = (req,res)=>{
    try{
        const user = jwt.decode(req.cookies.token);
        user.password = null;
        res.status(200).json(user)
    }
    catch(error){
        console.log("invalid cookie for getting the user ",error);
        res.status(400).send({
            message:"Invalid user"
        })
    }
}