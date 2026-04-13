import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";

export async function POST(req) {
  try {
    await connectDB();
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });
    const student = await Enrollment.findOne({ email: email.toLowerCase().trim() });
    if (!student) return NextResponse.json({ error: "No enrollment found with this email." }, { status: 404 });
    return NextResponse.json({ success: true, student });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}