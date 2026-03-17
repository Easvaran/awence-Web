import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password, age, dob, mobile } = await req.json();
    const normalizedEmail = email.toLowerCase().trim();
    await connectDB();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate unique employee ID (e.g., AWN-001)
    const count = await User.countDocuments({ role: "employee" });
    const employeeId = `AWN-${(count + 1).toString().padStart(3, '0')}`;

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
    return NextResponse.json({ error: "Failed to create account" }, { status: 500 });
  }
}
