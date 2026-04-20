import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Staff from "@/models/Staff";
import Attendance from "@/models/Attendance";
import Schedule from "@/models/Schedule";
import Enrollment from "@/models/Enrollment";

// POST — fetch staff data
export async function POST(req) {
  try {
    await connectDB();
    const { staffId } = await req.json();
    if (!staffId) return NextResponse.json({ success: false, error: "No staffId" });

    const staff = await Staff.findById(staffId).lean();
    if (!staff) return NextResponse.json({ success: false, error: "Staff not found" });

    const schedules = await Schedule.find({ teacher: staff.name }).lean();
    const students  = await Enrollment.find({ status: { $ne: "cancelled" } }).sort({ createdAt: -1 }).lean();
    const attendance = await Attendance.find({ markedBy: staff.name }).sort({ date: -1 }).lean();

    return NextResponse.json({ success: true, staff, schedules, students, attendance });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// PUT — save attendance session using records[] array
export async function PUT(req) {
  try {
    await connectDB();
    const { className, classId, date, markedBy, records } = await req.json();
    // records = [{ personId, personName, status }]

    // Try to find existing attendance for this class+date
    let att = await Attendance.findOne({ className, date, type: "student" });

    if (att) {
      // Update existing records
      for (const rec of records) {
        const existing = att.records.find(r => r.personId === rec.personId);
        if (existing) {
          existing.status = rec.status;
        } else {
          att.records.push(rec);
        }
      }
      att.markedBy = markedBy;
      await att.save();
    } else {
      // Create new attendance document
      att = await Attendance.create({
        type: "student",
        classId: classId || className,
        className,
        date,
        markedBy,
        records,
      });
    }

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