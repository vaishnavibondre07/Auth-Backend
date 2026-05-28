import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import cloudinary from "../config/cloudinary.js"
import { uploader } from "../controllers/upload.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const uploadRouter = Router()

uploadRouter.post("/upload", authMiddleware, upload.single("file"), uploader);

export default uploadRouter;