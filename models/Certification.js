import mongoose from "mongoose";

const CertificationSchema = new mongoose.Schema(
  {
    studentName: { type: String, required: true },
    studentId:   { type: String, required: true },
    cert:        { type: String, default: "" },
    examDate:    { type: String, default: "" },
    score:       { type: String, default: "" },
    passed:      { type: Boolean, default: false },
    notes:       { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Certification ||
  mongoose.model("Certification", CertificationSchema);