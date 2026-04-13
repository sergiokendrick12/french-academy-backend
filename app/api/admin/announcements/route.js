import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function GET() {
  try {
    await connectDB();
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    return NextResponse.json({ announcements });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const { title, message, type, audience } = body;
    if (!title || !message) return NextResponse.json({ error: "Title and message required" }, { status: 400 });
    const announcement = await Announcement.create({ title, message, type, audience });
    return NextResponse.json({ success: true, announcement });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Announcement.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await connectDB();
    const { id, active } = await req.json();
    await Announcement.findByIdAndUpdate(id, { active });
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}