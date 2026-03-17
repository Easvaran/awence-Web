import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    employeeId: { type: String, unique: true, sparse: true }, // Unique ID like AWN-001
    department: { type: String },
    position: { type: String },
    manager: { type: String },
    age: { type: Number },
    dob: { type: String },
    mobile: { type: String },
    isApproved: { type: Boolean, default: false }, // For admin approval
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // Status field
    resetOtp: { type: String },
    resetOtpExpires: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
