import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Quiz from "@/models/Quiz";

export async function GET() {
  try {
    await connectDB();
    const quizzes = await Quiz.find({ active: true }).sort({ createdAt: -1 });
    return NextResponse.json({ quizzes });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}