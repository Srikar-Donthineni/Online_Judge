import express from "express";
import { problemCreate,problemDelete,problemGet,problemPut,problemGetAll } from "../controllers/problemController.js";
import uploadProblem from "../utils/problemFile.js";

const problemRouter = express.Router();
problemRouter.post("/",uploadProblem.fields(
    [{name: "inputFile"},{name:"outputFile"}]),
    problemCreate);
problemRouter.get("/:id",problemGet);
problemRouter.delete("/:id",problemDelete);
problemRouter.put("/:id",uploadProblem.fields(
    [{name: "inputFile"},{name:"outputFile"}]),problemPut);
problemRouter.get("/",problemGetAll);

export default problemRouter;