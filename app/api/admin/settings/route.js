import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    const { currentPassword, newPassword } = await req.json();
    
    if (currentPassword !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ success: false, error: "Current password is incorrect" }, { status: 401 });
    }
    
    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json({ success: false, error: "Password too short" }, { status: 400 });
    }

    // Note: To fully persist, update ADMIN_PASSWORD in Vercel env vars manually
    return NextResponse.json({ success: true, message: "Password verified. Please update ADMIN_PASSWORD in Vercel environment variables to: " + newPassword });
  } catch(e) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
