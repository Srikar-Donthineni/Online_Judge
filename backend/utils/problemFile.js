import multer from "multer";

const storage = multer.memoryStorage();
const uploadProblem = multer({storage});

export default uploadProblem;