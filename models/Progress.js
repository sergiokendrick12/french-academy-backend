import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema({
  studentId:   { type: String, required: true },
  studentName: { type: String, required: true },
  level:       { type: String, enum: ["A1","A2","B1","B2","C1","C2"], required: true },
  note:        { type: String, default: "" },
  updatedBy:   { type: String, default: "admin" },
}, { timestamps: true });

export default mongoose.models.Progress ||
  mongoose.model("Progress", ProgressSchema);