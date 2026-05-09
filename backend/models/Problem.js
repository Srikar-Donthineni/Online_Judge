import mongoose from "mongoose";

const Schema = mongoose.Schema;

const problemSchema = new Schema({
    title : {type:String , require:true , unique:true},
    slug : {type:String,require:true,unique:true},
    problemStatement : {type:String , require:true , unique:true},
    sampleInput : {type:String , require:true},
    sampleOutput : {type:String , require:true},
    inputFileName : {type:String , require:true},
    outputFileName : {type:String,require:true}
});

const problemModel = mongoose.model("problem",problemSchema);
export default problemModel;