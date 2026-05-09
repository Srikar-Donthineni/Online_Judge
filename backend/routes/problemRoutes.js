import express from "express";
import { problemCreate,problemDelete,problemGet,problemPut,problemGetAll } from "../controllers/problemController.js";
import uploadProblem from "../utils/problemFile.js";
import {authorize} from "../middleware/Authorization.js";

const problemRouter = express.Router();
problemRouter.post("/",authorize(['admin']),uploadProblem.fields(
    [{name: "inputFile"},{name:"outputFile"}]),
    problemCreate);
problemRouter.get("/:slug",problemGet);
problemRouter.delete("/:slug",authorize(['admin']),problemDelete);
problemRouter.put("/:slug",authorize(['admin']),uploadProblem.fields(
    [{name: "inputFile"},{name:"outputFile"}]),problemPut);
problemRouter.get("/",problemGetAll);

export default problemRouter;