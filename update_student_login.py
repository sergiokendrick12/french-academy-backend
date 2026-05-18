content = """import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    
    const student = await Enrollment.findOne({ email: email.toLowerCase().trim() });
    if (!student) return NextResponse.json({ error: "No enrollment found with this email." }, { status: 404 });

    // If student has no password yet, allow login with email only (first time)
    if (!student.passwordHash) {
      return NextResponse.json({ success: true, student, firstLogin: true });
    }

    if (!password) return NextResponse.json({ error: "Password required" }, { status: 400 });
    
    const valid = await bcrypt.compare(password, student.passwordHash);
    if (!valid) return NextResponse.json({ error: "Incorrect password." }, { status: 401 });

    return NextResponse.json({ success: true, student });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
"""
f = open('app/api/student/login/route.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Login API updated!')
