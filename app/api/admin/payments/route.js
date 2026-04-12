import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET(req) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const payments = await Payment.find().sort({ createdAt: -1 });
  return NextResponse.json({ payments });
}

export async function POST(req) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const body = await req.json();
  const payment = await Payment.create(body);
  return NextResponse.json({ success: true, payment });
}

export async function DELETE(req) {
  if (!requireAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectDB();
  const { id } = await req.json();
  await Payment.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}