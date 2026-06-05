import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Resource from "@/models/Resource";

export async function GET() {
  try {
    await connectDB();
    const resources = await Resource.find().sort({ createdAt: -1 });
    return NextResponse.json({ resources });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const type = formData.get("type");
    const level = formData.get("level");
    const description = formData.get("description");
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const url = `data:${file.type};base64,${base64}`;
    const resource = await Resource.create({ title, type, level, description, url, fileName: file.name });
    return NextResponse.json({ success: true, resource });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Resource.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}