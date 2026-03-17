import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "Late", "On Leave"], default: "Present" },
    checkIn: { type: String },
    checkOut: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
