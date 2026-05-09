import express from "express";
import {authorize} from "../middleware/Authorization.js";
import {runCode,submitCode} from "../controllers/codeController.js";

const code = express.Router();
code.post("/runcode",runCode)
code.post("/submitcode",authorize(["user","admin"]),submitCode)

export default code;