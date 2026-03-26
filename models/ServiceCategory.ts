import mongoose from "mongoose";

const ServiceItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  iconName: { type: String, required: true }, // Store lucide-react icon name as string
  color: { type: String, default: "text-blue-500" }
});

const ServiceCategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    items: [ServiceItemSchema],
    className: { type: String }, // e.g., "lg:col-span-1 lg:row-span-1"
    titleColor: { type: String }, // e.g., "text-blue-600"
    isDark: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.models.ServiceCategory || mongoose.model("ServiceCategory", ServiceCategorySchema);
