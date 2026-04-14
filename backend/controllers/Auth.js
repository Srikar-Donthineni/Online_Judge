import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Register = async (req,res)=>{
    console.log(req.body);
    const {firstname,lastname,email,password} = req.body;
    if(!(firstname && lastname && email && password)){
        return res.status(400).send({message:"Please enter all four values"});
    }
    const existUseremail = await User.findOne({ email: req.body.email});
    if (existUseremail) {
        return res.status(400).send({message:"User already exists"});
    }
    const hashedPassword = bcrypt.hashSync(password,10);
    //creating the jwt token
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign({name:firstname,email}, jwtSecretKey);
    // sending the jwt token in the response
    const newUser = new User({ 
        firstname,
        lastname,
        email,
        password:hashedPassword
        });
    await newUser.save();
    const userObj = newUser.toObject();
    userObj.token = token;
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
        if(bcrypt.compare(req.body.password,user.password)){
            const jwtSecretKey = process.env.JWT_SECRET_KEY;
            const token = jwt.sign({name:user.firstname,email:user.email}, jwtSecretKey);
            user.password= null;
            user.token = token;
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