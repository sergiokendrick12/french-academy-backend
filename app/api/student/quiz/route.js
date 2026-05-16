import { NextResponse } from "next/server";
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
}