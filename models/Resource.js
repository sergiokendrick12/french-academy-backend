import mongoose from "mongoose";
const ResourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, default: "PDF" },
  level: { type: String, default: "All levels" },
  url: String,
}, { timestamps: true });
export default mongoose.models.Resource || mongoose.model("Resource", ResourceSchema);