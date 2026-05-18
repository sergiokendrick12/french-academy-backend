import os
os.makedirs('app/api/student/change-password', exist_ok=True)

content = """import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { studentId, currentPassword, newPassword } = await req.json();
    
    const student = await Enrollment.findById(studentId);
    if (!student) return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });

    // If student has existing password, verify it
    if (student.passwordHash) {
      if (!currentPassword) return NextResponse.json({ success: false, error: "Current password required" }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, student.passwordHash);
      if (!valid) return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    student.passwordHash = hash;
    await student.save();

    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
"""
f = open('app/api/student/change-password/route.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Done!')
