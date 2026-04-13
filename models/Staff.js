import mongoose from "mongoose";

const StaffSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true },
    role:   { type: String, required: true },
    email:  { type: String, default: "" },
    phone:  { type: String, default: "" },
    classes:{ type: Number, default: 0 },
    status: { type: String, default: "active" },
  },
  { timestamps: true }
);

export default mongoose.models.Staff ||
  mongoose.model("Staff", StaffSchema);