import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    type:      { type: String, enum: ["student","staff"], required: true },
    classId:   { type: String, default: "" },
    className: { type: String, default: "" },
    date:      { type: String, required: true },
    lockedAt:  { type: Date, default: null },
    isLocked:  { type: Boolean, default: false },
    markedBy:  { type: String, default: "admin" },
    markedAt:  { type: Date, default: Date.now },
    records: [
      {
        personId:   { type: String, default: "" },
        personName: { type: String, required: true },
        status:     { type: String, enum: ["present","absent","late"], default: "present" },
        note:       { type: String, default: "" },
        markedAt:   { type: Date, default: Date.now },
      }
    ],
  },
  { timestamps: true }
);

// Prevent duplicate attendance for same class+date+type
AttendanceSchema.index({ type: 1, classId: 1, date: 1 }, { unique: true });

export default mongoose.models.Attendance ||
  mongoose.model("Attendance", AttendanceSchema);