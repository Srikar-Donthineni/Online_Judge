import problemModel from "../models/Problem.js";
import uploadToS3,{deleteFromS3} from "../utils/s3Operations.js";

export const problemCreate = async (req,res)=>{
    const slug = req.body.title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")   
      .replace(/\s+/g, "-")            
      .replace(/-+/g, "-");  
    try {
      const prob = new problemModel({
        title : req.body.title,
        slug,
        problemStatement : req.body.problemStatement,
        sampleInput : req.body.sampleInput,
        sampleOutput : req.body.sampleOutput,
        inputFileName : req.files.inputFile[0].originalname,
        outputFileName : req.files.outputFile[0].originalname
      })
      await prob.save();
      uploadToS3(req.files.inputFile[0],slug)
      uploadToS3(req.files.outputFile[0],slug)
     res.status(200).json(prob);
      } catch (error) {
         console.log("error in problem creation",error);
         res.status(400).send("error in problem creation",error);
      }
     
}

export const problemDelete = async (req,res)=>{ 
    try {
        const slug = req.params.slug;
        const problem = await problemModel.findOne({slug});
        if(!problem){
            res.status(400).send("problem doesn't exists");
        }
        else{
            deleteFromS3("inputFile",slug)
            deleteFromS3("outputFile",slug)
            res.status(200).send("problem deleted successfully")
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

export const problemPut = async (req,res)=>{
    try {
        const slug = req.params.slug
        const problem = await problemModel.findOne({slug})
        if(!problem){
            res.status(400).send("problem doesnt exists");
        }
        else{
            problem.title = req.body.title
            problem.problemStatement = req.body.problemStatement
            problem.sampleInput = req.body.sampleInput 
            problem.sampleOutput = req.body.sampleOutput
            await problem.save();
            if(req.files && req.files.inputFile){
                uploadToS3(req.files.inputFile[0],slug) 
            }
            if(req.files && req.files.outputFile){
                uploadToS3(req.files.outputFile[0],slug)
            }
            res.status(200).json(problem);
        }

    } catch (error) {
        console.log("error updating problem", error);
    }
}

export const problemGet = async (req,res)=>{
      try {
        const slug = req.params.slug;
        console.log(req)
        console.log(slug)
        const problem = await problemModel.findOne({slug});
        if(!problem){
            res.status(400).send("problem not found")
        }
        else{
            res.status(200).json({
                problemStatement : problem.problemStatement,
                sampleInput : problem.sampleInput,
                sampleOutput : problem.sampleOutput,
                title : problem.title,
                slug:problem.slug
        });}
      } catch (error) {
        console.log("error getting the problem",error);
        res.status(400).send(error)
      }
}

export const problemGetAll = async (req,res)=>{
    try {
        const problems = await problemModel.find({});
        res.status(200).json(
  problems.map((problem) => ({
    problemStatement: problem.problemStatement,
    sampleInput: problem.sampleInput,
    sampleOutput: problem.sampleOutput,
    title: problem.title,
    slug: problem.slug,
  }))
);
    } catch (error) {
        console.log("error getting ",error)
        res.status(400).send(error);
    }
}