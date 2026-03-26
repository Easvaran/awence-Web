import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ServiceCategory from "@/models/ServiceCategory";

export async function GET() {
  try {
    await connectDB();
    const categories = await ServiceCategory.find({}).sort({ order: 1 });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Service Category GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch service categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const newCategory = await ServiceCategory.create(body);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Service Category POST Error:", error);
    return NextResponse.json({ error: "Failed to create service category" }, { status: 500 });
  }
}
