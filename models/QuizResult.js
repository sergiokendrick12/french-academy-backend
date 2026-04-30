import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  question: String,
  type: String,
  answer: String,
  correctAnswer: String,
  isCorrect: Boolean,
});

const QuizResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  quizTitle: { type: String, default: "" },
  studentId: { type: String, required: true },
  studentName: { type: String, default: "" },
  answers: [AnswerSchema],
  score: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  passed: { type: Boolean, default: false },
  timeTaken: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.models.QuizResult || mongoose.model("QuizResult", QuizResultSchema);