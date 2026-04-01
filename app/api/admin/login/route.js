import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { success: false, error: "Invalid password." },
        { status: 401 }
      );
    }

    const token = await createToken({ role: "admin" });

    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 8,
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