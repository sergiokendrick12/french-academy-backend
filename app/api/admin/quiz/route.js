import { NextResponse } from "next/server";
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
}