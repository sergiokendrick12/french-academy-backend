import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";
import QuizResult from "@/models/QuizResult";

// GET — fetch available quizzes + check if already attempted
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    await connectDB();
    const quizzes = await Quiz.find({ isPublished: true }).sort({ createdAt: -1 });
    const results = await QuizResult.find({ studentEmail: email.toLowerCase() });

    const resultMap = {};
    results.forEach((r) => { resultMap[r.quizId.toString()] = r; });

    const data = quizzes.map((q) => ({
      _id: q._id,
      title: q.title,
      description: q.description,
      level: q.level,
      timeLimit: q.timeLimit,
      questionCount: q.questions.length,
      attempted: !!resultMap[q._id.toString()],
      result: resultMap[q._id.toString()] || null,
    }));

    return NextResponse.json({ success: true, quizzes: data });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// GET quiz questions for taking
export async function POST(request) {
  try {
    await connectDB();
    const { action, quizId, email, answers, timeTaken, studentName } = await request.json();

    if (action === "start") {
      // Check if already attempted
      const existing = await QuizResult.findOne({
        quizId,
        studentEmail: email.toLowerCase(),
      });
      if (existing)
        return NextResponse.json({ error: "already_attempted", result: existing }, { status: 400 });

      const quiz = await Quiz.findById(quizId);
      if (!quiz)
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

      // Return questions WITHOUT correct answers
      const questions = quiz.questions.map((q) => ({
        _id: q._id,
        type: q.type,
        question: q.question,
        options: q.options,
        points: q.points,
      }));

      return NextResponse.json({
        success: true,
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          timeLimit: quiz.timeLimit,
          level: quiz.level,
          questions,
        },
      });
    }

    if (action === "submit") {
      // Check if already attempted
      const existing = await QuizResult.findOne({
        quizId,
        studentEmail: email.toLowerCase(),
      });
      if (existing)
        return NextResponse.json({ error: "already_attempted", result: existing }, { status: 400 });

      const quiz = await Quiz.findById(quizId);
      if (!quiz)
        return NextResponse.json({ error: "Quiz not found" }, { status: 404 });

      // Grade answers
      let score = 0;
      let totalPoints = 0;
      const gradedAnswers = quiz.questions.map((q, i) => {
        const studentAnswer = answers[i] || "";
        const isCorrect =
          q.type === "written"
            ? null // written answers reviewed manually
            : studentAnswer.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
        const pts = isCorrect ? q.points : 0;
        if (q.type !== "written") totalPoints += q.points;
        if (isCorrect) score += pts;
        return {
          questionId: q._id.toString(),
          question: q.question,
          studentAnswer,
          correctAnswer: q.type === "written" ? null : q.correctAnswer,
          isCorrect,
          points: pts,
          maxPoints: q.points,
          type: q.type,
        };
      });

      const percentage = totalPoints > 0 ? Math.round((score / totalPoints) * 100) : 0;

      const result = await QuizResult.create({
        quizId,
        studentEmail: email.toLowerCase(),
        studentName,
        answers: gradedAnswers,
        score,
        totalPoints,
        percentage,
        timeTaken,
      });

      return NextResponse.json({ success: true, result, gradedAnswers });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}