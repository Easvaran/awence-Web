import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, age, dob, mobile } = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }
    
    const normalizedEmail = email.toLowerCase().trim();
    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate unique employee ID (e.g., AWN-001)
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
    const employeeId = `AWN-${nextNum.toString().padStart(3, '0')}`;

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "employee",
      employeeId,
      age,
      dob,
      mobile,
      isApproved: false,
      status: "pending",
    });

    return NextResponse.json({ message: "Account created successfully. Waiting for admin approval." }, { status: 201 });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Failed to create account", details: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
