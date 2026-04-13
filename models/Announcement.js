import mongoose from "mongoose";
const AnnouncementSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  message:  { type: String, required: true },
  type:     { type: String, enum: ["info","warning","success","urgent"], default: "info" },
  audience: { type: String, enum: ["all","students","staff"], default: "all" },
  active:   { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);