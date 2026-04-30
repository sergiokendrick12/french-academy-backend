import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema({
  questionId: { type: String },
  answer: { type: String },
  isCorrect: { type: Boolean },
  points: { type: Number, default: 0 },
});

const QuizResultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  studentEmail: { type: String, required: true, lowercase: true },
  studentName: { type: String },
  answers: [AnswerSchema],
  score: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  timeTaken: { type: Number },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.models.QuizResult || mongoose.model("QuizResult", QuizResultSchema);