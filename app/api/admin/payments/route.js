import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function GET() {
  try {
    await connectDB();
    const payments = await Payment.find().sort({ createdAt: -1 });
    return NextResponse.json({ payments });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const payment = await Payment.create(body);
    return NextResponse.json({ success: true, payment });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Payment.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}