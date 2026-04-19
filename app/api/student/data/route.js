import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Certification from "@/models/Certification";
import Attendance from "@/models/Attendance";
import Schedule from "@/models/Schedule";

export async function PUT(req) {
  try {
    await connectDB();
    const { studentId, firstName, lastName, email, phone } = await req.json();

    const Student = (await import("@/models/Student")).default;

    const student = await Student.findByIdAndUpdate(
      studentId,
      { firstName, lastName, email, phone },
      { new: true }
    );

    if (!student) return NextResponse.json({ success: false, error: "Student not found" });

    return NextResponse.json({ success: true, student });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}