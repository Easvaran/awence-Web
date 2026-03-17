import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");
    
    await connectDB();
    
    const query = projectId ? { projectId } : {};
    const reviews = await Review.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("Review GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { projectId, userName, rating, comment } = await req.json();

    if (!projectId || !userName || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const newReview = await Review.create({
      projectId,
      userName,
      rating,
      comment,
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error: any) {
    console.error("Review POST Error:", error);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
