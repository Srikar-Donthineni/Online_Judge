import {exec} from "child_process";
import fs from "fs";
import {v4 as uuidv4} from "uuid";
import { getFromS3 } from "./utils/s3Operations.js";
import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const getOutput = (language,code,input)=>{
    return new Promise((resolve, reject) => {
    const id = uuidv4();
    const tempDir = path.join('.','temp')
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir)
    }
    if (language === "python") {
      const fileName = `./temp/${id}.py`;
      fs.writeFileSync(fileName, code);

      const process = exec(`python ${fileName}`, (error, stdout, stderr) => {
        try { fs.unlinkSync(fileName); } catch (e) {}

        if (error) return reject(error.message); 
        if (stderr) return reject(stderr);         
        resolve({stdout,timedout:false});                           
      });
      let timedout = false;
      const timer = setTimeout(() => {
        timedout = true;
      process.kill('SIGKILL');
      try { fs.unlinkSync(fileName); } catch (e) {console.log("error unlinking file")}
      resolve({timedout:true});
    }, 2000);
    process.on('exit',()=>{
      clearTimeout(timer);
    })
      process.stdin.write(input);
      process.stdin.end();

    }
    if(language == "cpp"){
      const fileName = `./temp/${id}.cpp`;
      fs.writeFileSync(fileName, code);

      const process = exec(`g++ ${fileName} -o main && main`, (error, stdout, stderr) => {
        try { fs.unlinkSync(fileName); } catch (e) {}

        if (error) return reject(error.message); 
        if (stderr) return reject(stderr);         
        resolve({stdout,timedout:false});                            
      });
      let timedout = false;
      const timer = setTimeout(() => {
        timedout = true;
      process.kill('SIGKILL');
      try { fs.unlinkSync(fileName); } catch (e) {console.log("error unlinking file")}
      resolve({timedout:true});
    }, 5000);
    process.on('exit',()=>{
      clearTimeout(timer);
    })
      process.stdin.write(input);
      process.stdin.end();
    }
    if(language == "javascript"){
      const fileName = `./temp/${id}.js`;
      
      fs.writeFileSync(fileName, code);
      const process = exec(`node ${fileName}`, (error, stdout, stderr) => {
        try { fs.unlinkSync(fileName); } catch (e) {}

        if (error) return reject(error.message); 
        if (stderr) return reject(stderr);         
        resolve({stdout,timedout:false});                            
      });
      let timedout = false;
      const timer = setTimeout(() => {
        timedout = true;
      process.kill('SIGKILL');
      try { fs.unlinkSync(fileName); } catch (e) {console.log("error unlinking file")}
      resolve({timedout:true});
    }, 5000);
    process.on('exit',()=>{
      clearTimeout(timer);
    })
      process.stdin.write(input);
      process.stdin.end();
    }
    if(language == "java"){
      const fileName = `./temp/${id}.java`;
      
      fs.writeFileSync(fileName, code);
      const process = exec(`javac ${fileName} && java -cp ./temp Main `, (error, stdout, stderr) => {
        try { fs.unlinkSync(fileName);
            fs.unlinkSync("./temp/Main.class")
         } catch (e) {}

        if (error) return reject(error.message); 
        if (stderr) return reject(stderr);         
        resolve({stdout,timedout:false});                         
      });
      let timedout = false;
      const timer = setTimeout(() => {
        timedout = true;
      process.kill('SIGKILL');
      try { fs.unlinkSync(fileName); } catch (e) {console.log("error unlinking file")}
      resolve({timedout:true});
    }, 5000);
    process.on('exit',()=>{
      clearTimeout(timer);
    })
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
        res.status(400).json({error})
    }

}

export const submitCode = async (req,res)=>{
  try{
    const {code,language,slug} = req.body
    const inputFile = await getFromS3("inputFile",slug);
    const outputFile = await getFromS3("outputFile",slug);
    const inputContent = await inputFile.Body.transformToString();
    const outputContent = await outputFile.Body.transformToString();
    const inputs = inputContent.split("--input--").map(s=>s.trim()).filter(s=>s.length>0);
    const outputs = outputContent.split("--output--").map(s=>s.trim()).filter(s=>s.length>0);
    const success = [];
    const fail = [];
    const timedout = [];
    const total = outputs.length;
    for(let i=0;i<inputs.length;i++){
      let out = await getOutput(language,code,inputs[i]);
      if(out.timedout == true){
        timedout.push(i)
      }
      else if(out.stdout.trim()===outputs[i]){
        success.push(i);
      }
      else{
        fail.push(i)
      }
    }
    res.status(200).json({
      success,
      fail,
      timedout,
      total
    })
  }
  catch(error){
    console.log("error in submitting code ",error.message)
  }
}

const app = express();
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.listen(8000,()=>{
    console.log("Compiler Service is listening on port 8000")
})

app.post("/runcode",runCode);
app.post("/submitcode",submitCode);