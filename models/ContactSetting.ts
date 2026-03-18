import mongoose from "mongoose";

const ContactSettingSchema = new mongoose.Schema(
  {
    mapUrl: { type: String, required: true },
    address: { type: String },
    phone: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.ContactSetting || mongoose.model("ContactSetting", ContactSettingSchema);
