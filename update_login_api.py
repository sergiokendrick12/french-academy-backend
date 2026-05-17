# Update admin login API to require username + password
content = """import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (username !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Invalid username or password." },
        { status: 401 }
      );
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
    return NextResponse.json(
      { success: false, error: "Login failed." },
      { status: 500 }
    );
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
