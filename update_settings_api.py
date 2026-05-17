content = """import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AdminConfig from "@/models/AdminConfig";
import bcrypt from "bcryptjs";

export async function PATCH(req) {
  try {
    await connectDB();
    const { currentPassword, newPassword } = await req.json();

    const admin = await AdminConfig.findOne({});
    if (!admin) {
      return NextResponse.json({ success: false, error: "Admin not configured" }, { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });
    }

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "Password too short" }, { status: 400 });
    }

    const hash = await bcrypt.hash(newPassword, 12);
    admin.passwordHash = hash;
    await admin.save();

    return NextResponse.json({ success: true });
  } catch(e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
"""
f = open('app/api/admin/settings/route.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Settings API updated!')
