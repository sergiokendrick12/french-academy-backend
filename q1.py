content = '''import mongoose from "mongoose";
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
export default mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);'''
f = open('models/Quiz.js', 'w', encoding='utf-8')
f.write(content)
f.close()

content2 = '''import mongoose from "mongoose";
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
export default mongoose.models.QuizResult || mongoose.model("QuizResult", QuizResultSchema);'''
f = open('models/QuizResult.js', 'w', encoding='utf-8')
f.write(content2)
f.close()
print('Done!')
