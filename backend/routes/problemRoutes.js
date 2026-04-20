import express from "express";
import { problemCreate,problemDelete,problemGet,problemPut,problemGetAll } from "../controllers/problemController.js";
import uploadProblem from "../utils/problemFile.js";
import authorize from "../middleware/Authorization.js";

const problemRouter = express.Router();
problemRouter.post("/",authorize(['admin']),uploadProblem.fields(
    [{name: "inputFile"},{name:"outputFile"}]),
    problemCreate);
problemRouter.get("/:id",authorize(['user','admin']),problemGet);
problemRouter.delete("/:id",authorize(['admin']),problemDelete);
problemRouter.put("/:id",authorize(['admin']),uploadProblem.fields(
    [{name: "inputFile"},{name:"outputFile"}]),problemPut);
problemRouter.get("/",authorize(['admin','user']),problemGetAll);

export default problemRouter;