import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ClientVisit from "@/models/ClientVisit";

export async function GET() {
  try {
    await connectDB();
    const visits = await ClientVisit.find({}).sort({ createdAt: -1 });
    return NextResponse.json(visits);
  } catch (error: any) {
    console.error("ClientVisit GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch client visits" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { clientName, logo, visitDate, description, displaySize } = await req.json();

    if (!clientName || !logo) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const newVisit = await ClientVisit.create({
      clientName,
      logo, // Expecting Base64 string
      visitDate: visitDate || new Date(),
      description,
      displaySize: displaySize || 150,
    });

    return NextResponse.json(newVisit, { status: 201 });
  } catch (error: any) {
    console.error("ClientVisit POST Error:", error);
    return NextResponse.json({ error: "Failed to create client visit" }, { status: 500 });
  }
}
