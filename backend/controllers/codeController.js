import {exec} from "child_process";
import fs from "fs";
import {v4 as uuidv4} from "uuid";
import { getFromS3 } from "../utils/s3Operations.js";
import axios from "axios"

export const runCode = async (req,res)=>{
    const {language,code,sampleInput} = req.body
    try{
      console.log(language,code,sampleInput);
    const output = await axios.post("http://localhost:3001/runcode",{language:language,code:code,sampleInput:sampleInput})
    res.status(200).send({output:output.data.output})
    }
    catch(error){
        console.log(error)
        res.status(400).send({error:error.message})
    }

}

export const submitCode = async (req,res)=>{
  try{
  const {code,language,id} = req.body
  console.log("entereds")
  const output = await axios.post("http://localhost:3001/submitcode",{code:code,language:language,id:id})
  console.log(output)
  if(output.data.result == "accepted"){
    res.status(200).send({"result":"accepted"})
  }
  else{
    res.status(200).send({"result":"wrong"})
  }}
  catch(error){
    console.log("Error in submitting code ", error.message)
  }
}