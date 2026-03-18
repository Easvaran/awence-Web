import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ContactSetting from "@/models/ContactSetting";
import { auth } from "@/auth";

export async function GET() {
  try {
    await connectDB();
    let settings = await ContactSetting.findOne({});
    
    // Default settings if none exist
    if (!settings) {
      settings = await ContactSetting.create({
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.234567890!2d77.9860!3d9.8230!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zOcKwNDknMjIuOCJOIDc3wrA1OScxMC44IkU!5e0!3m2!1sen!2sin!4v1626345678901!5m2!1sen!2sin",
        address: "No 8, Bharathi Nagar, GH Road, Thirumangalam, Madurai 625706",
        phone: "+91 77086 65431",
        email: "support@awence.com",
      });
    }
    
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("ContactSetting GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch contact settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { mapUrl, address, phone, email } = await req.json();
    await connectDB();
    
    const settings = await ContactSetting.findOneAndUpdate(
      {},
      { mapUrl, address, phone, email },
      { new: true, upsert: true }
    );
    
    return NextResponse.json(settings);
  } catch (error: any) {
    console.error("ContactSetting POST Error:", error);
    return NextResponse.json({ error: "Failed to update contact settings" }, { status: 500 });
  }
}
