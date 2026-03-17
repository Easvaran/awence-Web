import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const deleted = await Project.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    console.error("Project DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
