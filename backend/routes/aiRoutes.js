import express from "express";
import codeReview from "../controllers/aiController.js";
import {authorize,aiLimit} from "../middleware/Authorization.js";


const aiRouter = express.Router();
aiRouter.post("/codeReview",authorize(["user","admin"]),aiLimit(),codeReview)

export default aiRouter;