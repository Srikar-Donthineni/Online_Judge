import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname : {type:String , require:true},
    lastname : {type:String},
    email : {type:String , unique : true},
    password : {type:String},
    role : {
        type:String,
        enum:["user","admin"],
        default:"user"
    }
}
);

const User = mongoose.model("user",userSchema);
export default User;