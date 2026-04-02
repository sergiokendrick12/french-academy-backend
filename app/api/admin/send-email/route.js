import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import nodemailer from "nodemailer";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.role === "admin";
}

export async function POST(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { to, subject, body, studentName } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"International French Academy" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #0d1b2a; color: #f0ede8; border-radius: 12px; overflow: hidden;">
          <div style="background: #c9a84c; padding: 20px 28px; display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 24px;">🎓</span>
            <div>
              <div style="font-size: 18px; font-weight: 600; color: #08111f;">International French Academy</div>
              <div style="font-size: 12px; color: #08111f99;">Kigali, Rwanda</div>
            </div>
          </div>
          <div style="padding: 32px 28px;">
            <p style="font-size: 15px; line-height: 1.8; white-space: pre-wrap; color: #f0ede8;">${body.replace(/\n/g, "<br/>")}</p>
          </div>
          <div style="padding: 20px 28px; border-top: 1px solid #1e3250; font-size: 12px; color: #7a8899;">
            <p>📧 frenchacademyinternational@gmail.com &nbsp;|&nbsp; 📱 +250 785 302 957 &nbsp;|&nbsp; 📍 Norrsken House, Kigali</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}