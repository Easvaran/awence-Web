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
    
    // Check if email is being changed and if it's already taken by another user
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: id } });
      if (existingUser) {
        return NextResponse.json({ error: "Email already registered by another user" }, { status: 400 });
      }
    }
    
    // Check if employee ID is being changed and if it's already taken
    if (employeeId) {
      const existingEmployeeId = await User.findOne({ employeeId, _id: { $ne: id } });
      if (existingEmployeeId) {
        return NextResponse.json({ error: "Employee ID already exists" }, { status: 400 });
      }
    }
    
    const updateData: any = { name, email, isApproved, status, age, dob, mobile, employeeId, department, position, manager };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await User.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true }
    ).select("-password");
    
    if (!updated) {
      return NextResponse.json({ error: "Employee not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Employee Error:", error);
    return NextResponse.json({ error: "Failed to update employee", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
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
    return NextResponse.json({ error: "Failed to delete employee", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
