import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"IFA Admin System" <${process.env.GMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "🔐 Your IFA Admin Password",
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 32px; background: #0d1b2a; color: #fff; border-radius: 8px;">
          <h2 style="color: #c9a84c;">IFA Admin Password Reminder</h2>
          <p>You requested your admin password.</p>
          <div style="background: rgba(201,168,76,0.1); border: 1px solid #c9a84c; border-radius: 4px; padding: 16px; margin: 24px 0;">
            <p style="margin: 0; font-size: 14px; color: rgba(255,255,255,0.6);">Your password is:</p>
            <p style="margin: 8px 0 0; font-size: 24px; font-weight: bold; color: #c9a84c; letter-spacing: 2px;">${process.env.ADMIN_PASSWORD}</p>
          </div>
          <p style="color: rgba(255,255,255,0.4); font-size: 12px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}