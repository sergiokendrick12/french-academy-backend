import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Staff from "@/models/Staff";

const defaultStaff = [
  {name:"KWIBUKA Erick",role:"Certification Manager & Head of Pedagogy",email:"erick@ifa.rw",phone:"+250785302957",classes:2,status:"active"},
  {name:"Banda Clément",role:"Lead Teacher & Sound Technician",email:"clement@ifa.rw",phone:"+250785302957",classes:3,status:"active"},
  {name:"Ingabire Germaine",role:"Secretary General & Communications",email:"germaine@ifa.rw",phone:"+250785302957",classes:1,status:"active"},
  {name:"Kabandana Ghislaine",role:"Reception & Media Library Assistant",email:"ghislaine@ifa.rw",phone:"+250785302957",classes:0,status:"active"},
  {name:"Iragi Michaël",role:"Cooperation Attaché & Legal Advisor",email:"michael@ifa.rw",phone:"+250785302957",classes:0,status:"active"},
  {name:"Joas Irahoza",role:"Multi-skilled Agent",email:"joas@ifa.rw",phone:"+250785302957",classes:0,status:"active"},
];

export async function GET() {
  try {
    await connectDB();
    let staff = await Staff.find().sort({ createdAt: 1 });
    if(staff.length === 0) {
      await Staff.insertMany(defaultStaff);
      staff = await Staff.find().sort({ createdAt: 1 });
    }
    return NextResponse.json({ staff });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const member = await Staff.create(body);
    return NextResponse.json({ success: true, member });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await Staff.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}