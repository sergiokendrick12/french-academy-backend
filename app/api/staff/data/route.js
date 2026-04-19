import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Staff from "@/models/Staff";
import Attendance from "@/models/Attendance";
import Schedule from "@/models/Schedule";
import Enrollment from "@/models/Enrollment";

// GET — fetch staff data, their schedules, students, attendance
export async function POST(req) {
  try {
    await connectDB();
    const { staffId } = await req.json();
    if (!staffId) return NextResponse.json({ success: false, error: "No staffId" });

    const staff = await Staff.findById(staffId).lean();
    if (!staff) return NextResponse.json({ success: false, error: "Staff not found" });

    // Get schedules where this teacher teaches
    const schedules = await Schedule.find({ teacher: staff.name }).lean();

    // Get all students (enrollments)
    const students = await Enrollment.find({ status: { $ne: "cancelled" } })
      .sort({ createdAt: -1 }).lean();

    // Get attendance records
    const attendance = await Attendance.find({}).sort({ date: -1 }).lean();

    return NextResponse.json({
      success: true,
      staff,
      schedules,
      students,
      attendance,
    });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// PUT — mark attendance for a student
export async function PUT(req) {
  try {
    await connectDB();
    const { studentId, className, date, status, markedBy } = await req.json();

    // Check if attendance already exists for this student/date/class
    const existing = await Attendance.findOne({ studentId, date, className });

    if (existing) {
      existing.status = status;
      await existing.save();
      return NextResponse.json({ success: true, attendance: existing, updated: true });
    }

    const att = await Attendance.create({ studentId, className, date, status, markedBy });
    return NextResponse.json({ success: true, attendance: att });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// PATCH — update staff profile
export async function PATCH(req) {
  try {
    await connectDB();
    const { staffId, phone } = await req.json();
    const staff = await Staff.findByIdAndUpdate(staffId, { phone }, { new: true });
    if (!staff) return NextResponse.json({ success: false, error: "Staff not found" });
    return NextResponse.json({ success: true, staff });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}