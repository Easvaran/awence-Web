import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import ServiceCategory from "@/models/ServiceCategory";

const defaultCategories = [
  {
    title: "Design & Prototyping",
    className: "lg:col-span-1 lg:row-span-1 bg-blue-600/10 border-blue-600/20",
    titleColor: "text-blue-600",
    isDark: false,
    order: 1,
    items: [
      { name: "Figma", iconName: "Layers", color: "text-purple-500" },
      { name: "Framer", iconName: "Framer", color: "text-blue-500" },
      { name: "Photoshop", iconName: "ImageIcon", color: "text-blue-400" },
      { name: "Illustrator", iconName: "PenTool", color: "text-orange-500" },
    ]
  },
  {
    title: "App Development (Web & Mobile)",
    className: "lg:col-span-2 lg:row-span-1 bg-slate-900 border-slate-800",
    titleColor: "text-white",
    isDark: true,
    order: 2,
    items: [
      { name: "Tailwind CSS", iconName: "Layout", color: "text-cyan-400" },
      { name: "JavaScript", iconName: "Code2", color: "text-yellow-400" },
      { name: "React", iconName: "Atom", color: "text-blue-400" },
      { name: "Dart", iconName: "Globe", color: "text-blue-500" },
      { name: "Flutter", iconName: "Smartphone", color: "text-blue-400" },
      { name: "MobX", iconName: "Zap", color: "text-orange-400" },
      { name: "Hive", iconName: "Database", color: "text-yellow-500" },
    ]
  },
  {
    title: "Backend Development",
    className: "lg:col-span-2 lg:row-span-1 bg-slate-900 border-slate-800",
    titleColor: "text-white",
    isDark: true,
    order: 3,
    items: [
      { name: "Express.js", iconName: "Server", color: "text-slate-400" },
      { name: ".NET", iconName: "Cpu", color: "text-purple-500" },
      { name: "Node.js", iconName: "Server", color: "text-green-500" },
      { name: "Python", iconName: "Code2", color: "text-blue-500" },
      { name: "Firebase", iconName: "Flame", color: "text-orange-500" },
      { name: "Postman", iconName: "Send", color: "text-orange-400" },
      { name: "Redis", iconName: "Box", color: "text-red-500" },
    ]
  },
  {
    title: "Database",
    className: "lg:col-span-1 lg:row-span-1 bg-blue-600/10 border-blue-600/20",
    titleColor: "text-blue-600",
    isDark: false,
    order: 4,
    items: [
      { name: "MySQL", iconName: "Database", color: "text-blue-600" },
      { name: "MongoDB", iconName: "Database", color: "text-green-500" },
      { name: "Azure Cosmos DB", iconName: "Cloud", color: "text-blue-400" },
    ]
  },
  {
    title: "Automation & Testing",
    className: "lg:col-span-1 lg:row-span-1 bg-blue-600/10 border-blue-600/20",
    titleColor: "text-blue-600",
    isDark: false,
    order: 5,
    items: [
      { name: "Appium", iconName: "Smartphone", color: "text-red-500" },
      { name: "JMeter", iconName: "Zap", color: "text-red-400" },
      { name: "Selenium", iconName: "ShieldCheck", color: "text-green-500" },
      { name: "Playwright", iconName: "Layout", color: "text-green-400" },
    ]
  },
  {
    title: "DevOps & Deployment",
    className: "lg:col-span-2 lg:row-span-1 bg-slate-900 border-slate-800",
    titleColor: "text-white",
    isDark: true,
    order: 6,
    items: [
      { name: "Container Registry", iconName: "Box", color: "text-blue-400" },
      { name: "AWS", iconName: "Cloud", color: "text-orange-400" },
      { name: "Azure", iconName: "Cloud", color: "text-blue-500" },
      { name: "Google Cloud", iconName: "Globe", color: "text-red-400" },
      { name: "Terraform", iconName: "Box", color: "text-purple-400" },
      { name: "Docker", iconName: "Box", color: "text-blue-400" },
      { name: "GitHub Actions", iconName: "Github", color: "text-slate-400" },
    ]
  }
];

export async function GET() {
  try {
    await connectDB();
    let categories = await ServiceCategory.find({}).sort({ order: 1 });
    
    // Auto-seed if empty
    if (categories.length === 0) {
      await ServiceCategory.insertMany(defaultCategories);
      categories = await ServiceCategory.find({}).sort({ order: 1 });
    }
    
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Service Category GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch service categories" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const newCategory = await ServiceCategory.create(body);
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Service Category POST Error:", error);
    return NextResponse.json({ error: "Failed to create service category" }, { status: 500 });
  }
}
