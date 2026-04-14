import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import { sendBulkEmail } from "@/lib/email";

export async function POST(req) {
  try {
    await connectDB();
    const { subject, message, audience } = await req.json();

    if (!subject || !message) {
      return NextResponse.json({ error: "Subject and message required" }, { status: 400 });
    }

    let query = {};
    if (audience === "enrolled") query.status = "enrolled";
    else if (audience === "new") query.status = "new";
    else if (audience === "contacted") query.status = "contacted";

    const students = await Enrollment.find(query);
    if (students.length === 0) {
      return NextResponse.json({ error: "No students found for this audience" }, { status: 400 });
    }

    const emails = students.map(s => ({ email: s.email, name: `${s.firstName} ${s.lastName}` }));

    let sent = 0;
    let failed = 0;
    for (const recipient of emails) {
      try {
        await sendBulkEmail({ to: recipient.email, name: recipient.name, subject, message });
        sent++;
      } catch { failed++; }
    }

    return NextResponse.json({ success: true, sent, failed, total: emails.length });
  } catch(e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}