import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Certification from "@/models/Certification";
import Attendance from "@/models/Attendance";
import Schedule from "@/models/Schedule";

// ── GET all student data (payments, attendance, certs, schedules) ──
export async function POST(req) {
  try {
    await connectDB();
    const { studentId } = await req.json();
    if (!studentId) return NextResponse.json({ success: false, error: "No studentId" });

    const [payments, certifications, attendance, schedules] = await Promise.all([
      Payment.find({ studentId }).sort({ createdAt: -1 }).lean(),
      Certification.find({ studentId }).sort({ createdAt: -1 }).lean(),
      Attendance.find({ studentId }).sort({ date: -1 }).lean(),
      Schedule.find({}).sort({ createdAt: 1 }).lean(),
    ]);

    return NextResponse.json({
      success: true,
      payments,
      certifications,
      attendance,
      schedules,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// ── PUT update student profile ──
export async function PUT(req) {
  try {
    await connectDB();
    const { studentId, firstName, lastName, email, phone } = await req.json();
    const Student = (await import("@/models/Enrollment")).default;
    const student = await Student.findByIdAndUpdate(
      studentId,
      { firstName, lastName, email, phone },
      { new: true }
    );
    if (!student) return NextResponse.json({ success: false, error: "Student not found" });
    return NextResponse.json({ success: true, student });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}