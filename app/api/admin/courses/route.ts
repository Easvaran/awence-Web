import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({}).sort({ createdAt: -1 });
    return NextResponse.json(courses);
  } catch (error: any) {
    console.error("Course GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { title, image, description, displaySize, price, duration, instructor } = await req.json();

    if (!title || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const newCourse = await Course.create({
      title,
      image,
      description,
      displaySize: displaySize || 300,
      price,
      duration,
      instructor,
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error: any) {
    console.error("Course POST Error:", error);
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 });
  }
}
