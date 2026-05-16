import mongoose from "mongoose";
const QuestionSchema = new mongoose.Schema({
  question: String,
  type: { type: String, enum: ["multiple", "truefalse", "open"], default: "multiple" },
  options: [String],
  correct: Number,
  correctText: String,
});
const QuizSchema = new mongoose.Schema({
  title: String,
  description: String,
  duration: { type: Number, default: 30 },
  questions: [QuestionSchema],
  active: { type: Boolean, default: true },
}, { timestamps: true });
export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);