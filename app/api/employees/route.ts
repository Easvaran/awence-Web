import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// GET all employees
export async function GET() {
  try {
    await connectDB();
    const employees = await User.find({ role: "employee" }).select("-password").sort({ createdAt: -1 });
    return NextResponse.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 });
  }
}

// POST new employee
export async function POST(req: Request) {
  try {
    const { name, email, password, age, dob, mobile, status, isApproved, employeeId: providedId, department, position, manager } = await req.json();
    await connectDB();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password || "password123", 10);
    
    // Generate unique employee ID if not provided
    let employeeId = providedId;
    if (!employeeId) {
      const count = await User.countDocuments({ role: "employee" });
      employeeId = `AWN-${(count + 1).toString().padStart(3, '0')}`;
    }

    const newEmployee = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "employee",
      employeeId,
      department,
      position,
      manager,
      age,
      dob,
      mobile,
      status: status || "approved", // Admin created employees are approved by default
      isApproved: isApproved !== undefined ? isApproved : true,
    });

    const { password: _, ...employeeData } = newEmployee._doc;
    return NextResponse.json(employeeData, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create employee" }, { status: 500 });
  }
}
