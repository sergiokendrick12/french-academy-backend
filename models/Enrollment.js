import mongoose from "mongoose";

const EnrollmentSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    certificationGoal: {
      type: String,
      required: true,
      trim: true,
    },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "enrolled", "cancelled"],
      default: "new",
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Enrollment ||
  mongoose.model("Enrollment", EnrollmentSchema);