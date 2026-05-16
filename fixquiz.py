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

route = '''import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const QuizSchema = new mongoose.Schema({
      title: String, description: String,
      duration: { type: Number, default: 30 },
      questions: [new mongoose.Schema({ question: String, type: String, options: [String], correct: Number, correctText: String })],
      active: { type: Boolean, default: true },
    }, { timestamps: true });
    const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
    const quizzes = await Quiz.find({ active: true }).sort({ createdAt: -1 });
    return NextResponse.json({ quizzes });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}'''
f = open('app/api/student/quiz/route.js', 'w', encoding='utf-8')
f.write(route)
f.close()
print('Done!')
