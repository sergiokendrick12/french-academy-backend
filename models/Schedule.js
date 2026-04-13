import mongoose from "mongoose";

const ScheduleSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    day:      { type: String, required: true },
    time:     { type: String, default: "" },
    level:    { type: String, default: "" },
    teacher:  { type: String, default: "" },
    students: { type: Number, default: 0 },
    room:     { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.models.Schedule ||
  mongoose.model("Schedule", ScheduleSchema);