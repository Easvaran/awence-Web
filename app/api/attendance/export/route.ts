import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import User from "@/models/User";
import * as XLSX from "xlsx";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const month = searchParams.get("month"); // Format: YYYY-MM
    
    await connectDB();
    
    let query = {};
    if (month) {
      const [year, m] = month.split("-");
      const startDate = new Date(parseInt(year), parseInt(m) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(m), 0, 23, 59, 59);
      
      query = {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate({
        path: "employeeId",
        model: User
      })
      .sort({ date: 1 })
      .lean();

    // --- LOG SHEET DATA ---
    const logData = attendanceRecords.map((record: any) => {
      const user = record.employeeId;
      // If user is just an ID (not populated), user.employeeId will be undefined
      // If user is populated, user.employeeId will be the unique string ID like AWN-001
      const displayId = (typeof user === 'object' && user !== null) ? (user.employeeId || "N/A") : "N/A";
      const displayName = (typeof user === 'object' && user !== null) ? (user.name || "N/A") : "N/A";

      return {
        Date: record.date ? new Date(record.date).toLocaleDateString() : "N/A",
        "Employee ID": displayId,
        "Employee Name": displayName,
        "Department/Position": (typeof user === 'object' && user !== null) ? `${user.department || "N/A"} / ${user.position || "N/A"}` : "N/A",
        "Supervisor/Manager": (typeof user === 'object' && user !== null) ? (user.manager || "N/A") : "N/A",
        Email: (typeof user === 'object' && user !== null) ? (user.email || "N/A") : "N/A",
        Mobile: (typeof user === 'object' && user !== null) ? (user.mobile || "N/A") : "N/A",
        Age: (typeof user === 'object' && user !== null) ? (user.age || "N/A") : "N/A",
        Status: record.status || "N/A",
        "Check In": record.checkIn || "--:--",
        "Check Out": record.checkOut || "--:--",
        Remarks: record.notes || ""
      };
    });

    // --- SUMMARY SHEET DATA ---
    const employeeSummary: Record<string, any> = {};

    attendanceRecords.forEach((record: any) => {
      const user = record.employeeId;
      const empId = (typeof user === 'object' && user !== null) ? (user._id?.toString() || "Unknown") : "Unknown";
      
      if (!employeeSummary[empId]) {
        const displayId = (typeof user === 'object' && user !== null) ? (user.employeeId || "N/A") : "N/A";
        const displayName = (typeof user === 'object' && user !== null) ? (user.name || "N/A") : "N/A";

        employeeSummary[empId] = {
          "Employee ID": displayId,
          "Employee Name": displayName,
          "Department/Position": (typeof user === 'object' && user !== null) ? `${user.department || "N/A"} / ${user.position || "N/A"}` : "N/A",
          "Supervisor/Manager": (typeof user === 'object' && user !== null) ? (user.manager || "N/A") : "N/A",
          Email: (typeof user === 'object' && user !== null) ? (user.email || "N/A") : "N/A",
          "Total Present (P)": 0,
          "Total Absent (A)": 0,
          "Total Leaves (L/SL/PL)": 0,
          "Total Holidays (H)": 0,
          "Total Records": 0,
          Remarks: ""
        };
      }

      const summary = employeeSummary[empId];
      summary["Total Records"] += 1;

      if (record.status === "Present" || record.status === "Late") {
        summary["Total Present (P)"] += 1;
      } else if (record.status === "Absent") {
        summary["Total Absent (A)"] += 1;
      } else if (record.status === "On Leave") {
        summary["Total Leaves (L/SL/PL)"] += 1;
      } else if (record.status === "Holiday") {
        summary["Total Holidays (H)"] += 1;
      }

      if (record.notes) summary.Remarks = record.notes;
    });

    const summaryData = Object.values(employeeSummary).map((summary: any) => {
      const totalDays = summary["Total Present (P)"] + summary["Total Absent (A)"];
      const attendancePct = totalDays > 0 
        ? ((summary["Total Present (P)"] / totalDays) * 100).toFixed(1) + "%" 
        : "0%";
      
      const { "Total Records": _, ...rest } = summary;
      return {
        ...rest,
        "Attendance %": attendancePct
      };
    });

    // Create Excel workbook
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Daily Log
    const worksheetLog = XLSX.utils.json_to_sheet(logData);
    XLSX.utils.book_append_sheet(workbook, worksheetLog, "Attendance Log");

    // Sheet 2: Monthly Summary
    const worksheetSummary = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, worksheetSummary, "Monthly Summary");

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Set headers for download
    const fileName = month ? `Attendance_Report_${month}.xlsx` : "Attendance_Report_All.xlsx";
    
    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error: any) {
    console.error("Export Error:", error);
    return NextResponse.json({ error: "Failed to export data" }, { status: 500 });
  }
}
