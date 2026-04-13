import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

// Helper: is date older than 24 hours?
function isLocked(dateStr, markedAt) {
  const now = new Date();
  const marked = new Date(markedAt);
  const diffHours = (now - marked) / (1000 * 60 * 60);
  return diffHours > 24;
}

// Helper: is date in the future?
function isFutureDate(dateStr) {
  const today = new Date().toISOString().split("T")[0];
  return dateStr > today;
}

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const date = searchParams.get("date");
    const classId = searchParams.get("classId");

    const query = {};
    if (type) query.type = type;
    if (date) query.date = date;
    if (classId) query.classId = classId;

    const attendance = await Attendance.find(query).sort({ date: -1, createdAt: -1 });
    return NextResponse.json({ attendance });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { type, classId, className, date, records } = body;

    // Block future dates
    if (isFutureDate(date)) {
      return NextResponse.json({ error: "Cannot mark attendance for future dates." }, { status: 400 });
    }

    // Check for duplicate
    const existing = await Attendance.findOne({ type, classId, date });
    if (existing) {
      // Check if locked
      if (existing.isLocked || isLocked(date, existing.markedAt)) {
        return NextResponse.json({ error: "Attendance is locked after 24 hours and cannot be changed." }, { status: 403 });
      }
      // Update existing
      existing.records = records.map(r => ({ ...r, markedAt: new Date() }));
      existing.markedAt = new Date();
      await existing.save();
      return NextResponse.json({ success: true, attendance: existing, updated: true });
    }

    // Create new
    const attendance = await Attendance.create({
      type, classId, className, date,
      records: records.map(r => ({ ...r, markedAt: new Date() })),
      markedAt: new Date(),
      markedBy: "admin",
    });
    return NextResponse.json({ success: true, attendance, updated: false });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    const attendance = await Attendance.findById(id);
    if (!attendance) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (attendance.isLocked || isLocked(attendance.date, attendance.markedAt)) {
      return NextResponse.json({ error: "Already locked." }, { status: 403 });
    }
    attendance.isLocked = true;
    attendance.lockedAt = new Date();
    await attendance.save();
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}