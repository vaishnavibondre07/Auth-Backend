import { Router } from "express";
import upload from "../middleware/multer.middleware.js";
import cloudinary from "../config/cloudinary.js"
import { uploader, getFiles, deleteFile} from "../controllers/upload.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const uploadRouter = Router()

uploadRouter.post("/upload", authMiddleware, upload.array("files", 10), uploader);

uploadRouter.get("/my-files", authMiddleware, getFiles);

uploadRouter.delete("/delete/:id", authMiddleware, deleteFile);

export default uploadRouter;