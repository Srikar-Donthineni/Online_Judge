import {exec} from "child_process";
import fs from "fs";
import {v4 as uuidv4} from "uuid";
import { getFromS3 } from "../utils/s3Operations.js";

const getOutput = (language,code,input)=>{
    return new Promise((resolve, reject) => {
    const id = uuidv4();

    if (language === "python") {
      const fileName = `./temp/${id}.py`;
      fs.writeFileSync(fileName, code);

      const process = exec(`python ${fileName}`, (error, stdout, stderr) => {
        try { fs.unlinkSync(fileName); } catch (e) {}

        if (error) return reject(error.message); 
        if (stderr) return reject(stderr);         
        resolve(stdout);                           
      });

      process.stdin.write(input);
      process.stdin.end();
    }
})}





export const runCode = async (req,res)=>{
    const {language,code,sampleInput} = req.body
    try{
    const output = await getOutput(language,code,sampleInput)
    res.status(200).send({output})
    }
    catch(error){
        console.log(error)
        res.status(400).send({error})
    }

}

export const submitCode = async (req,res)=>{
  const {code,language,id} = req.body
  const inputFile = await getFromS3("inputFile",id);
  const outputFile = await getFromS3("outputFile",id);
  const inputContent = await inputFile.Body.transformToString();
  const outputContent = await outputFile.Body.transformToString();
  const output = await getOutput(language,code,inputContent)
  console.log("output",output)
  console.log("output:content",outputContent)
  if(output == outputContent){
    res.status(200).send({"result":"accepted"})
  }
  else{
    res.status(200).send({"result":"wrong"})
  }
}