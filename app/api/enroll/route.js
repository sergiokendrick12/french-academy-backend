import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import { sendAdminNotification, sendStudentConfirmation } from "@/lib/email";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, certificationGoal, message } = body;

    if (!firstName || !lastName || !email || !phone || !certificationGoal) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    await connectDB();
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Enrollment error:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}