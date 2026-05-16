content = '''import { NextResponse } from "next/server";
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
    const totalMarks = quiz.totalMarks && quiz.totalMarks > 0 ? quiz.totalMarks : total;
    const scaledScore = total > 0 ? Math.round((score / total) * totalMarks) : 0;
    const result = await QuizResult.create({ quizId, quizTitle: quiz.title, studentId, studentName, answers, score: scaledScore, total: totalMarks, timeTaken });
    return NextResponse.json({ success: true, score: scaledScore, total: totalMarks, result });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
'''
f = open('app/api/student/quiz/submit/route.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Done!')
