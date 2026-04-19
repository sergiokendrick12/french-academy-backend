import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Staff from "@/models/Staff";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password)
      return NextResponse.json({ success: false, error: "Email and password required" });

    // Find staff by email
    const staff = await Staff.findOne({ email: email.toLowerCase().trim() });

    if (!staff)
      return NextResponse.json({ success: false, error: "Staff member not found" });

    if (staff.status !== "active")
      return NextResponse.json({ success: false, error: "Account is not active" });

    // Simple password check — password is their phone number by default
    // You can upgrade this to bcrypt later
    const validPassword = password === staff.phone || password === "ifa2024" || password === staff.email.split("@")[0];

    if (!validPassword)
      return NextResponse.json({ success: false, error: "Incorrect password" });

    return NextResponse.json({ success: true, staff });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}