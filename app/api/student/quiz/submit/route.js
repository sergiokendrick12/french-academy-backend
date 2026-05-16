import { NextResponse } from "next/server";
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
}