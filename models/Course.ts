import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String, required: true }, // Base64 string
    description: { type: String },
    displaySize: { type: Number, default: 300 }, // Adjustable size in pixels
    price: { type: String },
    duration: { type: String },
    instructor: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", CourseSchema);
