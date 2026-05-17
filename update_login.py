content = """import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import AdminConfig from "@/models/AdminConfig";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    await connectDB();
    const { username, password } = await request.json();

    let admin = await AdminConfig.findOne({});
    
    // First time setup - create from env vars
    if (!admin) {
      const hash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
      admin = await AdminConfig.create({
        username: process.env.ADMIN_USERNAME || "ifa_admin",
        passwordHash: hash,
      });
    }

    if (username !== admin.username) {
      return NextResponse.json({ success: false, error: "Invalid username or password." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ success: false, error: "Invalid username or password." }, { status: 401 });
    }

    const token = await createToken({ role: "admin" });
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 8,
      path: "/",
    });
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: "Login failed." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_token");
  return response;
}
"""
f = open('app/api/admin/login/route.js', 'w', encoding='utf-8')
f.write(content)
f.close()
print('Login API updated!')
