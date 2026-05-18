content = """import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Staff from "@/models/Staff";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email || !password)
      return NextResponse.json({ success: false, error: "Email and password required" });

    const staff = await Staff.findOne({ email: email.toLowerCase().trim() });
    if (!staff)
      return NextResponse.json({ success: false, error: "Staff member not found" });
    if (staff.status !== "active")
      return NextResponse.json({ success: false, error: "Account is not active" });

    // If no passwordHash yet, use phone as default and hash it
    if (!staff.passwordHash) {
      const defaultPassword = staff.phone || "ifa2024";
      if (password !== defaultPassword) {
        return NextResponse.json({ success: false, error: "Incorrect password. Default is your phone number." });
      }
      // Auto-hash on first login
      const hash = await bcrypt.hash(defaultPassword, 12);
      staff.passwordHash = hash;
      await staff.save();
      return NextResponse.json({ success: true, staff });
    }

    const valid = await bcrypt.compare(password, staff.passwordHash);
    if (!valid)
      return NextResponse.json({ success: false, error: "Incorrect password" });

    return NextResponse.json({ success: true, staff });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
"""
f = open('app/api/staff/login/route.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Done!')
