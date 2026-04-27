import mongoose from "mongoose";

const CourseProgressSchema = new mongoose.Schema(
  {
    studentEmail: { type: String, required: true, lowercase: true, trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [{ type: String }],
    quizResults: [
      {
        lessonId: { type: String },
        score: { type: Number },
        total: { type: Number },
        completedAt: { type: Date, default: Date.now },
      },
    ],
    percentComplete: { type: Number, default: 0 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

CourseProgressSchema.index({ studentEmail: 1, courseId: 1 }, { unique: true });

export default mongoose.models.CourseProgress ||
  mongoose.model("CourseProgress", CourseProgressSchema);