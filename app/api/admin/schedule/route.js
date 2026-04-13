import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Schedule from "@/models/Schedule";

const defaultClasses = [
  {name:"TCF Canada Preparation",day:"Mon, Wed, Fri",time:"8H00 – 10H00",level:"B1–B2",teacher:"Banda Clément",students:12,room:"Room A"},
  {name:"DELF A1–A2 Beginners",day:"Tue, Thu",time:"18H00 – 20H00",level:"A1–A2",teacher:"KWIBUKA Erick",students:8,room:"Room B"},
  {name:"TEF Québec Intensive",day:"Mon – Fri",time:"9H00 – 12H00",level:"B2–C1",teacher:"Banda Clément",students:15,room:"Main Hall"},
  {name:"DALF C1/C2 Advanced",day:"Sat, Sun",time:"15H00 – 18H00",level:"C1–C2",teacher:"KWIBUKA Erick",students:6,room:"Room A"},
  {name:"General French Beginners",day:"Mon, Wed",time:"18H00 – 20H00",level:"A1",teacher:"Ingabire Germaine",students:20,room:"Room C"},
  {name:"DILF Weekend",day:"Sat",time:"9H00 – 12H00",level:"A1.1",teacher:"Ingabire Germaine",students:10,room:"Room B"},
];

export async function GET() {
  try {
    await connectDB();
    let classes = await Schedule.find().sort({ createdAt: 1 });
    if(classes.length === 0) {
      await Schedule.insertMany(defaultClasses);
      classes = await Schedule.find().sort({ createdAt: 1 });
    }
    return NextResponse.json({ classes });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const cls = await Schedule.create(body);
    return NextResponse.json({ success: true, cls });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Schedule.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}