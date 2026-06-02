import cloudinary from "../config/cloudinary.js"
import { uploadFile } from "../services/uploadFile.service.js";
import File from "../models/file.model.js"

export const uploader = async (req, res) => {
  try {

    const files = req.files || (req.file ? [req.file] : []);

    console.log("Received files:", files);

    // check files
    if (!files.length) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const uploadedFiles = [];

    for (const file of files) {

      // upload to cloudinary
      const result = await uploadFile(file.buffer);

      console.log("result:", result);

      // save in database
      const savedFile = await File.create({
        url: result.secure_url || result.url,
        public_id: result.public_id,
        fileType: file.mimetype,
        uploadedBy: req.user.id,
      });

      uploadedFiles.push(savedFile);
    }

    return res.status(200).json({
      success: true,
      data: uploadedFiles,
    });

  } catch (error) {

    console.log("UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFiles = async (req, res) => {
  try {

    const userId = req.user.id;

    const files = await File.find({
      uploadedBy: userId,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: files.length,
      files,
    });

  } catch (error) {

    console.log("Get Files Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch files",
    });
  }
};

export const deleteFile = async (req, res) => {
  try {

    const { id } = req.params;

    // find file
    const file = await File.findById(id);

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    console.log("file owner:", file.uploadedBy.toString());
    console.log("logged user:", req.user.id);
    console.log(req.user);

    // ownership check
    if (file.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(file.public_id);

    // delete from db
    await File.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });

  } catch (error) {

    console.log("DELETE FILE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};