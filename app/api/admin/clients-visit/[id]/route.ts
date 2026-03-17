import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ClientVisit from "@/models/ClientVisit";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const deleted = await ClientVisit.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error: any) {
    console.error("ClientVisit DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
