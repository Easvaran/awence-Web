import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ServiceCategory from "@/models/ServiceCategory";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    await connectDB();
    
    const updated = await ServiceCategory.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true }
    );
    
    if (!updated) {
      return NextResponse.json({ error: "Service category not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Service Category PUT Error:", error);
    return NextResponse.json({ error: "Failed to update service category" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const deleted = await ServiceCategory.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Service category not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Service category deleted successfully" });
  } catch (error: any) {
    console.error("Service Category DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete service category" }, { status: 500 });
  }
}
