content = '''import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import QuizResult from "@/models/QuizResult";
export async function GET() {
  try {
    await connectDB();
    const results = await QuizResult.find().sort({ createdAt: -1 });
    return NextResponse.json({ results });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
export async function DELETE(req) {
  try {
    await connectDB();
    const { id } = await req.json();
    await QuizResult.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch(e) { return NextResponse.json({ error: e.message }, { status: 500 }); }
}
'''
f = open('app/api/admin/quiz/results/route.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('API updated!')
