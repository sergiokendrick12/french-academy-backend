import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";
import { sendAdminNotification, sendStudentConfirmation } from "@/lib/email";
import { sendWhatsAppNotification } from "@/lib/whatsapp";

export async function POST(request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, certificationGoal, message } = body;
    console.log("Received:", { firstName, lastName, email, phone, certificationGoal, message });

    // Validation
    if (!firstName || !lastName || !email || !phone || !certificationGoal) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Save to MongoDB
    await connectDB();
    const enrollment = await Enrollment.create({
      firstName,
      lastName,
      email,
      phone,
      certificationGoal,
      message: message || "",
    });

    // Send notifications
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
      {
        success: true,
        message: "Enrollment request received! We will contact you within 24–48 hours.",
        id: enrollment._id,
      },
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