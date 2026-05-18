import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Staff from "@/models/Staff";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { staffId, currentPassword, newPassword } = await req.json();

    const staff = await Staff.findById(staffId);
    if (!staff) return NextResponse.json({ success: false, error: "Staff not found" }, { status: 404 });

    // Verify current password
    if (staff.passwordHash) {
      if (!currentPassword) return NextResponse.json({ success: false, error: "Current password required" }, { status: 400 });
      const valid = await bcrypt.compare(currentPassword, staff.passwordHash);
      if (!valid) return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });
    } else {
      // No hash yet - verify against phone
      if (currentPassword !== staff.phone && currentPassword !== "ifa2024") {
        return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });
      }
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    staff.passwordHash = hash;
    await staff.save();

    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
