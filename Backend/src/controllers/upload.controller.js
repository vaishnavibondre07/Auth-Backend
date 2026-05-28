// import cloudinary from "../config/cloudinary.js"
import { uploadFile } from "../services/uploadFile.service.js";
import File from "../models/file.model.js"

export const uploader = async (req, res) => {

    try {

        const file = req.file;

        if(!file){
            return res.status(400).json({
                success: false,
                message : "No file uploaded"
            })
        }

        const result = await uploadFile(req.file.buffer);

        console.log("result " ,result);

        try {
          const savedFile = await File.create({
            url: result.url,
            public_id: result.public_id,
            fileType: file.mimetype,
            user: req.user.userId
          });

          console.log(savedFile)

          return res.status(200).json({
            success: true,
            data: savedFile,
          });

        } catch (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

    } catch(error){
        res.status(500).json({
            success: false,
            message : error.message
        })
    }
};