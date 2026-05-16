import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Certification from "@/models/Certification";

export async function GET() {
  try {
    await connectDB();
    const certifications = await Certification.find().sort({ createdAt: -1 });
    return NextResponse.json({ certifications });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const certification = await Certification.create(body);
    return NextResponse.json({ success: true, certification });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Certification.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}