import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Progress from "@/models/Progress";

export async function GET() {
  try {
    await connectDB();
    const progress = await Progress.find().sort({ updatedAt: -1 });
    return NextResponse.json({ progress });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { studentId, studentName, level, note } = await req.json();
    if (!studentId || !level) return NextResponse.json({ error: "studentId and level required" }, { status: 400 });

    const existing = await Progress.findOne({ studentId });
    if (existing) {
      existing.level = level;
      existing.note = note || "";
      existing.studentName = studentName;
      await existing.save();
      return NextResponse.json({ success: true, progress: existing });
    }

    const progress = await Progress.create({ studentId, studentName, level, note });
    return NextResponse.json({ success: true, progress });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}