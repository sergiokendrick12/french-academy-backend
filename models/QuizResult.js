import mongoose from "mongoose";
const QuizResultSchema = new mongoose.Schema({
  quizId: String,
  quizTitle: String,
  studentId: String,
  studentName: String,
  answers: [mongoose.Schema.Types.Mixed],
  score: Number,
  total: Number,
  timeTaken: Number,
  submittedAt: { type: Date, default: Date.now },
});
export default mongoose.models.QuizResult || mongoose.model("QuizResult", QuizResultSchema);