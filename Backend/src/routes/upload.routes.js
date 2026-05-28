import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import cloudinary from "../config/cloudinary.js"
import { uploader } from "../controllers/upload.controller.js";

const uploadRouter = Router()

uploadRouter.post("/upload", upload.single("file"), uploader);

export default uploadRouter;