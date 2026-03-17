import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Contact from "@/models/Contact";

// UPDATE contact message status
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json();
    
    await connectDB();
    
    const updated = await Contact.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!updated) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Contact PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}

// DELETE contact message
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    await connectDB();
    
    const deleted = await Contact.findByIdAndDelete(id);
    
    if (!deleted) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error("Contact DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
