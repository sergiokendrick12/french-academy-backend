import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Enrollment from "@/models/Enrollment";

async function isAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;
  if (!token) return false;
  const payload = await verifyToken(token);
  return payload?.role === "admin";
}

// GET all enrollments
export async function GET(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");

    const query = {};
    if (status && status !== "all") query.status = status;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const enrollments = await Enrollment.find(query).sort({ createdAt: -1 });

    const [total, newCount, contacted, enrolled, cancelled] = await Promise.all([
      Enrollment.countDocuments(),
      Enrollment.countDocuments({ status: "new" }),
      Enrollment.countDocuments({ status: "contacted" }),
      Enrollment.countDocuments({ status: "enrolled" }),
      Enrollment.countDocuments({ status: "cancelled" }),
    ]);

    return NextResponse.json({
      enrollments,
      stats: { total, new: newCount, contacted, enrolled, cancelled },
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch enrollments" }, { status: 500 });
  }
}

// PATCH — update status or notes
export async function PATCH(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id, status, notes } = await request.json();

    const update = {};
    if (status) update.status = status;
    if (notes !== undefined) update.notes = notes;

    const updated = await Enrollment.findByIdAndUpdate(id, update, { new: true });

    if (!updated) {
      return NextResponse.json({ error: "Enrollment not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, enrollment: updated });c

  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE — remove enrollment
export async function DELETE(request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const { id } = await request.json();
    await Enrollment.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}