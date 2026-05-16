import { NextResponse } from "next/server";
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
}