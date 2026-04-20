import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import { sendAdminNotification, sendStudentConfirmation } from "@/lib/email";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: CORS });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, certificationGoal, message } = body;

    if (!firstName || !lastName || !email || !phone || !certificationGoal) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400, headers: CORS }
      );
    }

    await connectDB();

    // Check for duplicate email
    const existing = await Enrollment.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "This email is already registered. Please contact us directly at frenchacademyinternational@gmail.com" },
        { status: 409, headers: CORS }
      );
    }

    const enrollment = await Enrollment.create({
      firstName, lastName, email, phone, certificationGoal,
      message: message || "",
    });

    try {
      await Promise.all([
        sendAdminNotification(enrollment),
        sendStudentConfirmation(enrollment),
        sendWhatsAppNotification(enrollment),
      ]);
    } catch (notifError) {
      console.error("Notification error:", notifError.message);
    }

    return NextResponse.json(
      { success: true, message: "Enrollment request received!", id: enrollment._id },
      { status: 201, headers: CORS }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500, headers: CORS }
    );
  }
}