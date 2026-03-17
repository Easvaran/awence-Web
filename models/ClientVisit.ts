import mongoose from "mongoose";

const ClientVisitSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    logo: { type: String, required: true }, // Base64 string for now
    visitDate: { type: Date, default: Date.now },
    description: { type: String },
    displaySize: { type: Number, default: 150 }, // Adjustable size in pixels
  },
  { timestamps: true }
);

export default mongoose.models.ClientVisit || mongoose.model("ClientVisit", ClientVisitSchema);
