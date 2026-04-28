import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";
import { isAuthenticated } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, courses });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const formData = await request.formData();
    const title = formData.get("title");
    const description = formData.get("description");
    const level = formData.get("level");
    const file = formData.get("file");

    if (!file) return NextResponse.json({ success: false, error: "No file uploaded" });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    const uploaded = await cloudinary.uploader.upload(dataUri, {
      resource_type: "raw",
      folder: "ifa-courses",
      public_id: `${Date.now()}-${file.name}`,
    });

    const course = await Course.create({
      title,
      description,
      level: level || "B1",
      fileName: file.name,
      fileUrl: uploaded.secure_url,
      fileType: file.type,
      fileSize: file.size,
      isPublished: true,
      lessons: [],
      assignedStudents: [],
    });

    return NextResponse.json({ success: true, course });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  if (!(await isAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await connectDB();
    const { id } = await request.json();
    await Course.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}