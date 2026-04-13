import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";
import Certification from "@/models/Certification";
import Attendance from "@/models/Attendance";
import Schedule from "@/models/Schedule";

export async function POST(req) {
  try {
    await connectDB();
    const { studentId, email } = await req.json();

    const [payments, certifications, schedules] = await Promise.all([
      Payment.find({ studentId }).sort({ createdAt: -1 }),
      Certification.find({ studentId }).sort({ createdAt: -1 }),
      Schedule.find().sort({ createdAt: 1 }),
    ]);

    // Get attendance for this student
    const allAttendance = await Attendance.find({ type: "student" }).sort({ date: -1 });
    const myAttendance = [];
    allAttendance.forEach(a => {
      const rec = a.records.find(r => r.personId === studentId);
      if(rec) myAttendance.push({ date: a.date, className: a.className, status: rec.status, note: rec.note });
    });

    return NextResponse.json({ success: true, payments, certifications, schedules, attendance: myAttendance });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}