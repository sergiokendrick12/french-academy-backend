import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import QuizResult from "@/models/QuizResult";
export async function GET() {
  try {
    await connectDB();
    const results = await QuizResult.find().sort({ createdAt: -1 });
    return NextResponse.json({ results });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
