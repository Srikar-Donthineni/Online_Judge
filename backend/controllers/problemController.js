import problemModel from "../models/Problem.js";
import uploadToS3,{deleteFromS3} from "../utils/s3Operations.js";

export const problemCreate = async (req,res)=>{
    try {
      const prob = new problemModel({
        title : req.body.title,
        problemStatement : req.body.problemStatement,
        sampleInput : req.body.sampleInput,
        sampleOutput : req.body.sampleOutput,
        inputFileName : req.files.inputFile[0].originalname,
        outputFileName : req.files.outputFile[0].originalname
      })
      await prob.save();
      const problemId = prob._id.toString();
      uploadToS3(req.files.inputFile[0],problemId)
      uploadToS3(req.files.outputFile[0],problemId)
     res.status(200).json(prob);
      } catch (error) {
         console.log("error in problem creation",error);
         res.status(400).send("error in problem creation",error);
      }
     
}

export const problemDelete = async (req,res)=>{ 
    try {
        const problemId = req.params.id;
        const problem = await problemModel.findByIdAndDelete(problemId);
        if(!problem){
            res.status(400).send("problem doesn't exists");
        }
        else{
            deleteFromS3("inputFile",problemId)
            deleteFromS3("outputFile",problemId)
            res.status(200).send("problem deleted successfully")
        }
    } catch (error) {
        console.log("error deleting probelm",error);
        res.status(400).send(error);
    }
}

export const problemPut = async (req,res)=>{
    try {
        const problemId = req.params.id
        const problem = await problemModel.findById(problemId)
        if(!problem){
            console.log("problem doesnt exist");
            res.status(400).send("problem doesnt exists");
        }
        else{
            problem.title = req.body.title
            problem.problemStatement = req.body.problemStatement
            problem.sampleInput = req.body.sampleInput 
            problem.sampleOutput = req.body.sampleOutput
            await problem.save();
            console.log(req.files);
            if(req.files && req.files.inputFile){
                uploadToS3(req.files.inputFile[0],problemId) 
            }
            if(req.files && req.files.outputFile){
                uploadToS3(req.files.outputFile[0],problemId)
            }
            res.status(200).json(problem);
        }

    } catch (error) {
        console.log("error updating problem", error);
    }
}

export const problemGet = async (req,res)=>{
      try {
        const problemId = req.params.id;
        const problem = await problemModel.findById(problemId);
        if(!problem){
            res.status(400).send("problem not found")
        }
        else{
            res.status(200).json(problem);}
      } catch (error) {
        console.log("error getting the problem",error);
        res.status(400).send(error)
      }
}

export const problemGetAll = async (req,res)=>{
    try {
        const problems = await problemModel.find({});
        res.status(200).json(problems);
    } catch (error) {
        console.log("error getting ",error)
        res.status(400).send(error);
    }
}