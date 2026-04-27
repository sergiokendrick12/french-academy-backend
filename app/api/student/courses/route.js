import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import CourseProgress from "@/models/CourseProgress";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email)
    return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    await connectDB();
    const courses = await Course.find({
      assignedStudents: email.toLowerCase(),
      isPublished: true,
    }).sort({ createdAt: -1 });

    const progressList = await CourseProgress.find({
      studentEmail: email.toLowerCase(),
      courseId: { $in: courses.map((c) => c._id) },
    });

    const progressMap = {};
    progressList.forEach((p) => {
      progressMap[p.courseId.toString()] = p;
    });

    const result = courses.map((c) => ({
      _id: c._id,
      title: c.title,
      description: c.description,
      level: c.level,
      lessonCount: c.lessons.length,
      lessons: c.lessons.map((l) => ({
        _id: l._id,
        title: l.title,
        type: l.type,
        order: l.order,
      })),
      progress: progressMap[c._id.toString()] || null,
    }));

    return NextResponse.json({ success: true, courses: result });
  } catch {
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}