import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, courses });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, level, fileName, fileUrl, fileType, fileSize } = body;
    const course = await Course.create({
      title,
      description,
      level: level || "B1",
      fileName,
      fileUrl,
      fileType,
      fileSize,
      isPublished: true,
      lessons: [],
      assignedStudents: [],
    });
    return NextResponse.json({ success: true, course });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await connectDB();
    const { id } = await request.json();
    await Course.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}