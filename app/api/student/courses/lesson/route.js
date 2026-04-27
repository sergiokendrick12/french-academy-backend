import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import CourseProgress from "@/models/CourseProgress";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("courseId");
  const lessonId = searchParams.get("lessonId");
  const email = searchParams.get("email");

  if (!courseId || !lessonId || !email)
    return NextResponse.json({ error: "Missing params" }, { status: 400 });

  try {
    await connectDB();
    const course = await Course.findOne({
      _id: courseId,
      assignedStudents: email.toLowerCase(),
      isPublished: true,
    });
    if (!course)
      return NextResponse.json({ error: "Not found or no access" }, { status: 404 });

    const lesson = course.lessons.id(lessonId);
    if (!lesson)
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });

    return NextResponse.json({ success: true, lesson });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { email, courseId, lessonId, quizResult } = await request.json();

    const course = await Course.findOne({
      _id: courseId,
      assignedStudents: email.toLowerCase(),
      isPublished: true,
    });
    if (!course)
      return NextResponse.json({ error: "No access" }, { status: 403 });

    let progress = await CourseProgress.findOne({
      studentEmail: email.toLowerCase(),
      courseId,
    });

    if (!progress) {
      progress = await CourseProgress.create({
        studentEmail: email.toLowerCase(),
        courseId,
        completedLessons: [],
        quizResults: [],
      });
    }

    if (!progress.completedLessons.includes(lessonId)) {
      progress.completedLessons.push(lessonId);
    }

    if (quizResult) {
      const existing = progress.quizResults.findIndex(
        (q) => q.lessonId === lessonId
      );
      if (existing >= 0) {
        progress.quizResults[existing] = { ...quizResult, lessonId };
      } else {
        progress.quizResults.push({ ...quizResult, lessonId });
      }
    }

    const totalLessons = course.lessons.length;
    progress.percentComplete =
      totalLessons > 0
        ? Math.round((progress.completedLessons.length / totalLessons) * 100)
        : 0;

    if (progress.percentComplete === 100 && !progress.completedAt) {
      progress.completedAt = new Date();
    }

    await progress.save();
    return NextResponse.json({ success: true, progress });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Failed" }, { status: 500 });
  }
}