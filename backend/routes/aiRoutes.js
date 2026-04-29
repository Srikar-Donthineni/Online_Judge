import express from "express";
import codeReview from "../controllers/aiController.js";
import authorize from "../middleware/Authorization.js";


const aiRouter = express.Router();
aiRouter.post("/codeReview",authorize(["user","admin"]),codeReview)

export default aiRouter;