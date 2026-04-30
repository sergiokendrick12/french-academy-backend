import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import QuizResult from "@/models/QuizResult";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get("studentId");
    const quizzes = await Quiz.find({ isPublished: true }).sort({ createdAt: -1 });
    const results = studentId ? await QuizResult.find({ studentId }) : [];
    const resultMap = {};
    results.forEach(r => { resultMap[r.quizId.toString()] = r; });
    const quizzesWithStatus = quizzes.map(q => ({
      _id: q._id,
      title: q.title,
      description: q.description,
      level: q.level,
      timeLimit: q.timeLimit,
      questionCount: q.questions.length,
      questions: q.questions,
      result: resultMap[q._id.toString()] || null,
    }));
    return NextResponse.json({ success: true, quizzes: quizzesWithStatus });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { quizId, studentId, studentName, answers, timeTaken } = await request.json();
    const quiz = await Quiz.findById(quizId);
    if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

    // Check already submitted
    const existing = await QuizResult.findOne({ quizId, studentId });
    if (existing) return NextResponse.json({ error: "Already submitted" }, { status: 400 });

    // Auto-grade
    let score = 0, totalPoints = 0;
    const gradedAnswers = quiz.questions.map((q, i) => {
      const answer = answers[i] || "";
      totalPoints += q.points || 1;
      const isCorrect = q.type !== "written" && answer === q.correctAnswer;
      if (isCorrect) score += q.points || 1;
      return { question: q.question, answer, correctAnswer: q.correctAnswer, isCorrect, type: q.type };
    });

    const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;
    const passed = percentage >= 60;

    const result = await QuizResult.create({
      quizId, studentId, studentName,
      answers: gradedAnswers,
      score, totalPoints, percentage, passed, timeTaken,
    });

    return NextResponse.json({ success: true, result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}