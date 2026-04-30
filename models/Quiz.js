import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema({
  type: { type: String, enum: ["multiple", "truefalse", "written"], required: true },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
  points: { type: Number, default: 1 },
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  level: { type: String, enum: ["A1","A2","B1","B2","C1","C2","All levels"], default: "All levels" },
  timeLimit: { type: Number, required: true },
  isPublished: { type: Boolean, default: false },
  questions: [QuestionSchema],
}, { timestamps: true });

export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);