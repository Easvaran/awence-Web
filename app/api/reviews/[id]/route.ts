import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    
    const deleted = await Review.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error: any) {
    console.error("Review DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
  }
}
