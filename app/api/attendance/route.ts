import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import User from "@/models/User";

// GET all attendance
export async function GET() {
  try {
    await connectDB();
    const attendance = await Attendance.find({}).populate("employeeId", "name email").sort({ date: -1 });
    return NextResponse.json(attendance);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

// POST new attendance
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const newAttendance = await Attendance.create(body);
    return NextResponse.json(newAttendance, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create attendance" }, { status: 500 });
  }
}
