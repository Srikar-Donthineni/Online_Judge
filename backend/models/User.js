const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstname : {type:String , require:true},
    lastname : {type:String},
    email : {type:String , unique : true},
    password : {type:String}
}
);

module.exports = mongoose.model("user",userSchema);