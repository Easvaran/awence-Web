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
    return NextResponse.json({ error: "Failed to fetch employees", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}

// POST new employee
export async function POST(req: Request) {
  try {
    const { name, email, password, age, dob, mobile, status, isApproved, employeeId: providedId, department, position, manager } = await req.json();
    
    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
    }
    
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
      // Find the highest existing employee ID number
      const lastEmployee = await User.findOne({ role: "employee", employeeId: { $regex: /^AWN-\d+$/ } })
        .sort({ employeeId: -1 })
        .select("employeeId");
      
      let nextNum = 1;
      if (lastEmployee && lastEmployee.employeeId) {
        const match = lastEmployee.employeeId.match(/AWN-(\d+)/);
        if (match) {
          nextNum = parseInt(match[1]) + 1;
        }
      }
      employeeId = `AWN-${nextNum.toString().padStart(3, '0')}`;
    } else {
      // Check if provided employee ID already exists
      const existingEmployeeId = await User.findOne({ employeeId });
      if (existingEmployeeId) {
        return NextResponse.json({ error: "Employee ID already exists" }, { status: 400 });
      }
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
    console.error("Error creating employee:", error);
    return NextResponse.json({ error: "Failed to create employee", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
