import mongoose from "mongoose";

const DocumentSchema = new mongoose.Schema(
  {
    originalFileName: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    filePath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    content: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["processing", "ready", "failed"],
      default: "processing",
    },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", DocumentSchema);

export default Document;
