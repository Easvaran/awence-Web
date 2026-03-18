import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import NavSetting from "@/models/NavSetting";

// Default nav links
const defaultNavLinks = [
  { name: "home", label: "Home", href: "/", order: 1 },
  { name: "about", label: "About", href: "/about", order: 2 },
  { name: "services", label: "Services", href: "/services", order: 3 },
  { name: "projects", label: "Projects", href: "/projects", order: 4 },
  { name: "reviews", label: "Reviews", href: "/reviews", order: 5 },
  { name: "courses", label: "Courses", href: "/courses", order: 6 },
  { name: "contact", label: "Contact", href: "/contact", order: 7 },
  { name: "clients", label: "Clients", href: "/clients", order: 8 },
];

export async function GET() {
  try {
    await connectDB();
    let settings = await NavSetting.find({}).sort({ order: 1 });
    
    // Initialize if empty
    if (settings.length === 0) {
      await NavSetting.insertMany(defaultNavLinks);
      settings = await NavSetting.find({}).sort({ order: 1 });
    } else {
      // Check if projects exists, if not add it
      const hasProjects = settings.find(s => s.name === "projects");
      if (!hasProjects) {
        await NavSetting.create({ name: "projects", label: "Projects", href: "/projects", order: 4 });
      }

      // Check if reviews exists, if not add it
      const hasReviews = settings.find(s => s.name === "reviews");
      if (!hasReviews) {
        await NavSetting.create({ name: "reviews", label: "Reviews", href: "/reviews", order: 5 });
      }

      // Check if courses exists, if not add it
      const hasCourses = settings.find(s => s.name === "courses");
      if (!hasCourses) {
        await NavSetting.create({ name: "courses", label: "Courses", href: "/courses", order: 6 });
      }

      settings = await NavSetting.find({}).sort({ order: 1 });
    }
    
    const filteredSettings = settings.filter((s: any) => s.name !== 'showcase');
    return NextResponse.json(filteredSettings);
  } catch (error: any) {
    console.error("NavSetting GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch nav settings" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { id, isVisible } = await req.json();
    await connectDB();
    
    const updated = await NavSetting.findByIdAndUpdate(
      id,
      { isVisible },
      { new: true }
    );
    
    if (!updated) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }
    
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("NavSetting PUT Error:", error);
    return NextResponse.json({ error: "Failed to update nav setting" }, { status: 500 });
  }
}
