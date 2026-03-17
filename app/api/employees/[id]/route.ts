import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import Attendance from "@/models/Attendance";

// UPDATE employee
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, email, password, isApproved, status, age, dob, mobile, employeeId, department, position, manager } = await req.json();
    await connectDB();
    
    const updateData: any = { name, email, isApproved, status, age, dob, mobile, employeeId, department, position, manager };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).select("-password");
    
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update employee" }, { status: 500 });
  }
}

// DELETE employee
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    // First, delete all attendance records for this employee
    await Attendance.deleteMany({ employeeId: id });
    // Then, delete the employee user account
    await User.findByIdAndDelete(id);
    
    return NextResponse.json({ message: "Employee and all their records deleted successfully" });
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 });
  }
}
