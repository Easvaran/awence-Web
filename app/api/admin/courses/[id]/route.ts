import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Course from "@/models/Course";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const deleted = await Course.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error: any) {
    console.error("Course DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete course" }, { status: 500 });
  }
}
