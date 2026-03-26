import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    projectName: { type: String, required: true },
    image: { type: String, required: true }, // Base64 string
    description: { type: String },
    displaySize: { type: Number, default: 200 }, // Adjustable size in pixels
    category: { type: String },
    link: { type: String },
    status: { type: String, default: 'Shipped' }, // e.g., 'Shipped', 'WIP', 'RIP'
    projectType: { type: String, enum: ['General', 'IT'], default: 'General' },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);
