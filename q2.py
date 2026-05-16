import os
os.makedirs('app/api/admin/quiz', exist_ok=True)
os.makedirs('app/api/student/quiz', exist_ok=True)

# Admin quiz API
content = '''import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";

export async function GET() {
  try {
    await connectDB();
    const quizzes = await Quiz.find().sort({ createdAt: -1 });
    return NextResponse.json({ quizzes });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const quiz = await Quiz.create(body);
    return NextResponse.json({ success: true, quiz });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Quiz.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}'''
f = open('app/api/admin/quiz/route.js', 'w', encoding='utf-8')
f.write(content)
f.close()

# Student quiz API
os.makedirs('app/api/student/quiz/submit', exist_ok=True)
os.makedirs('app/api/student/quiz/results', exist_ok=True)

content2 = '''import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";

export async function GET() {
  try {
    await connectDB();
    const quizzes = await Quiz.find({ active: true }).sort({ createdAt: -1 });
    return NextResponse.json({ quizzes });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}'''
f = open('app/api/student/quiz/route.js', 'w', encoding='utf-8')
f.write(content2)
f.close()

content3 = '''import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import QuizResult from "@/models/QuizResult";
import Quiz from "@/models/Quiz";

export async function POST(req) {
  try {
    await connectDB();
    const { quizId, studentId, studentName, answers, timeTaken } = await req.json();
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    let score = 0;
    let total = 0;
    quiz.questions.forEach((q, i) => {
      if (q.type === "open") return;
      total++;
      if (answers[i] !== undefined && answers[i] !== null && Number(answers[i]) === Number(q.correct)) score++;
    });
    const result = await QuizResult.create({ quizId, quizTitle: quiz.title, studentId, studentName, answers, score, total, timeTaken });
    return NextResponse.json({ success: true, score, total, result });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}'''
f = open('app/api/student/quiz/submit/route.js', 'w', encoding='utf-8')
f.write(content3)
f.close()

content4 = '''import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import QuizResult from "@/models/QuizResult";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const studentId = searchParams.get("studentId");
    const results = await QuizResult.find({ studentId }).sort({ submittedAt: -1 });
    return NextResponse.json({ results });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}'''
f = open('app/api/student/quiz/results/route.js', 'w', encoding='utf-8')
f.write(content4)
f.close()

print('Done! All quiz API routes created.')
