import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectType = searchParams.get("projectType") || "General";
    
    await connectDB();
    const projects = await Project.find({ projectType }).sort({ createdAt: -1 });
    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Project GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { projectName, image, description, displaySize, category, link, status, startDate, endDate, projectType } = await req.json();

    if (!projectName || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    const newProject = await Project.create({
      projectName,
      image,
      description,
      displaySize: displaySize || 200,
      category,
      link,
      status,
      startDate,
      endDate,
      projectType: projectType || 'General',
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error: any) {
    console.error("Project POST Error:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
