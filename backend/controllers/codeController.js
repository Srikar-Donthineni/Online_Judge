import {exec} from "child_process";
import fs from "fs";
import {v4 as uuidv4} from "uuid";
import { getFromS3 } from "../utils/s3Operations.js";
import axios from "axios"
import { OpenAI } from "openai";
import dotenv from "dotenv";
dotenv.config();


export const runCode = async (req,res)=>{
    const {language,code,sampleInput} = req.body
    try{
    const output = await axios.post("https://backend.srikarweb.com:8000/runcode",{language:language,code:code,sampleInput:sampleInput})
    res.status(200).send({output:output.data.output})
    }
    catch(error){
        res.status(400).send({error:error.response.data.error})
    }

}

export const submitCode = async (req,res)=>{
  try{
  const {code,language,slug,problemStatement} = req.body
  const output = await axios.post("https://backend.srikarweb.com:8000/submitcode",{code:code,language:language,slug:slug})
  res.status(200).json({
    success:output.data.success,
    fail:output.data.fail,
    timedout:output.data.timedout,  
    total:output.data.total
  })
}
  catch(error){
    console.log("Error in submitting code ", error.message)
  }
}