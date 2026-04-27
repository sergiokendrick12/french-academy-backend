import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ["text", "pdf", "quiz"], required: true },
  content: { type: String, default: "" },
  pdfUrl: { type: String, default: "" },
  order: { type: Number, default: 0 },
  quiz: [
    {
      question: { type: String },
      options: [{ type: String }],
      correctIndex: { type: Number },
    },
  ],
});

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    level: { type: String, enum: ["A1","A2","B1","B2","C1","C2"], required: true },
    isPublished: { type: Boolean, default: false },
    lessons: [LessonSchema],
    assignedStudents: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);