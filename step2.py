import os
os.makedirs('app/api/admin/resources', exist_ok=True)
content = '''import { NextResponse } from "next/server";
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
    const body = await req.json();
    const resource = await Resource.create(body);
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
}'''
f = open('app/api/admin/resources/route.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Done!')
