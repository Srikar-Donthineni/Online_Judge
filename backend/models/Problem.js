import mongoose from "mongoose";

const Schema = mongoose.Schema;

const problemSchema = new Schema({
    title : {type:String , require:true},
    problemStatement : {type:String , require:true},
    sampleInput : {type:String , require:true},
    sampleOutput : {type:String , require:true}
});

const problemModel = mongoose.model("problem",problemSchema);
export default problemModel;