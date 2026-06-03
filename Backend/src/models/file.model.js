import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({

  originalName: {
    type: String,
    required: true,
  },

  url: {
    type: String,
    required: true,
  },

  public_id: {
    type: String,
    required: true,
  },

  fileType: {
    type: String, // image, pdf, video
  },

  resourceType: {
    type: String, // image, raw, video
  },

  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

}, 
{ timestamps: true }
);


export default mongoose.model("File", fileSchema);