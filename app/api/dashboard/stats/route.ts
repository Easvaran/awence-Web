import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Attendance from "@/models/Attendance";

export async function GET() {
  try {
    await connectDB();

    // 1. Total Employees (approved only)
    const totalEmployees = await User.countDocuments({ role: "employee", status: "approved" });

    // 2. Today's Date Range (start and end of day)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 3. Today's Attendance Records
    const todayAttendance = await Attendance.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    // 4. Calculate Stats
    const presentToday = todayAttendance.filter(a => a.status === "Present").length;
    const lateToday = todayAttendance.filter(a => a.status === "Late").length;
    const onLeave = todayAttendance.filter(a => a.status === "On Leave" || a.status === "Absent").length;

    // 5. Weekly Attendance Data (last 7 days)
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayAttendance = await Attendance.find({
        date: { $gte: dayStart, $lte: dayEnd }
      });

      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      weeklyData.push({
        day: dayName,
        present: dayAttendance.filter(a => a.status === "Present" || a.status === "Late").length,
        absent: dayAttendance.filter(a => a.status === "Absent" || a.status === "On Leave").length,
      });
    }

    return NextResponse.json({
      totalEmployees,
      presentToday,
      lateToday,
      onLeave,
      weeklyData
    });
  } catch (error) {
    console.error("Dashboard Stats API Error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 });
  }
}
