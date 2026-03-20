"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Filter, X, Download, Calendar, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Employee {
  _id: string;
  employeeId?: string;
  name: string;
  email: string;
}

interface AttendanceRecord {
  _id: string;
  employeeId: {
    _id: string;
    employeeId?: string;
    name: string;
    email: string;
  };
  date: string;
  status: string;
  checkIn: string;
  checkOut: string;
  notes?: string;
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AttendanceRecord | null>(null);

  // Export states
  const [exportMonth, setExportMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

  // Form states
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedStatus, setSelectedStatus] = useState("Present");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchAttendance();
    fetchEmployees();
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(`/api/attendance/export?month=${exportMonth}`);
      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Attendance_Report_${exportMonth}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success("Report downloaded successfully");
    } catch (error) {
      toast.error("Failed to download report");
    } finally {
      setExporting(false);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAttendance(data);
      }
    } catch (error) {
      toast.error("Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      }
    } catch (error) {
      console.error("Failed to fetch employees", error);
    }
  };

  const resetForm = () => {
    setEditingRecord(null);
    setSelectedEmployee("");
    setSelectedDate(new Date().toISOString().split('T')[0]);
    setSelectedStatus("Present");
    setCheckIn("");
    setCheckOut("");
    setNotes("");
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (record: AttendanceRecord) => {
    setEditingRecord(record);
    setSelectedEmployee(record.employeeId._id);
    setSelectedDate(new Date(record.date).toISOString().split('T')[0]);
    setSelectedStatus(record.status);
    setCheckIn(record.checkIn || "");
    setCheckOut(record.checkOut || "");
    setNotes(record.notes || "");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployee) {
      toast.error("Please select an employee");
      return;
    }

    const payload = {
      employeeId: selectedEmployee,
      date: selectedDate,
      status: selectedStatus,
      checkIn,
      checkOut,
      notes
    };

    try {
      const url = editingRecord ? `/api/attendance/${editingRecord._id}` : "/api/attendance";
      const method = editingRecord ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(editingRecord ? "Record updated" : "Record added");
        setIsModalOpen(false);
        fetchAttendance();
      } else {
        toast.error("Failed to save record");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const deleteRecord = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;
    try {
      const res = await fetch(`/api/attendance/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Record deleted");
        fetchAttendance();
      }
    } catch (error) {
      toast.error("Failed to delete record");
    }
  };

  const filteredAttendance = attendance.filter((record) =>
    record.employeeId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Employee Attendance</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">Manage and track daily employee attendance.</p>
        </div>
        <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto">
          <Plus size={18} /> Add Record
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-6 lg:items-end bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Search employees..."
              className="pl-10 h-11 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="w-full lg:w-48">
          <Label className="mb-2 block text-xs font-semibold text-slate-500 uppercase tracking-wider">Select Month</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <Input 
              type="month"
              className="pl-10 h-11 bg-white"
              value={exportMonth}
              onChange={(e) => setExportMonth(e.target.value)}
            />
          </div>
        </div>

        <Button 
          onClick={handleExport}
          disabled={exporting}
          variant="outline" 
          className="gap-2 h-11 px-6 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-all font-semibold w-full lg:w-auto justify-center"
        >
          {exporting ? <Loader2 className="animate-spin" size={18} /> : <Download size={18} />}
          Download Report
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-card border border-border rounded-xl overflow-hidden shadow-sm overflow-x-auto">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 border-b border-border">
            <tr>
              <th className="px-6 py-4 font-semibold text-sm">Employee</th>
              <th className="px-6 py-4 font-semibold text-sm">Date</th>
              <th className="px-6 py-4 font-semibold text-sm">Status</th>
              <th className="px-6 py-4 font-semibold text-sm">Check In</th>
              <th className="px-6 py-4 font-semibold text-sm">Check Out</th>
              <th className="px-6 py-4 font-semibold text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  Loading attendance records...
                </td>
              </tr>
            ) : filteredAttendance.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  No records found.
                </td>
              </tr>
            ) : (
              filteredAttendance.map((record) => (
                <tr key={record._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium">{record.employeeId?.name}</div>
                    <div className="text-xs text-muted-foreground">{record.employeeId?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      record.status === 'Present' ? 'bg-green-100 text-green-700' :
                      record.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                      record.status === 'On Leave' ? 'bg-blue-100 text-blue-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">{record.checkIn || "-"}</td>
                  <td className="px-6 py-4 text-sm">{record.checkOut || "-"}</td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button 
                      onClick={() => openEditModal(record)}
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-blue-600"
                    >
                      <Edit2 size={16} />
                    </Button>
                    <button 
                      onClick={() => deleteRecord(record._id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {loading ? (
          <div className="py-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
            Loading attendance records...
          </div>
        ) : filteredAttendance.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
            No records found.
          </div>
        ) : (
          filteredAttendance.map((record) => (
            <div key={record._id} className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-slate-900">{record.employeeId?.name}</div>
                  <div className="text-xs text-muted-foreground">{record.employeeId?.email}</div>
                </div>
                <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${
                  record.status === 'Present' ? 'bg-green-100 text-green-700' :
                  record.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                  record.status === 'On Leave' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm pt-2 border-t border-slate-50">
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Date</p>
                  <p className="font-medium">{new Date(record.date).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">Check In/Out</p>
                  <p className="font-medium text-xs">
                    {record.checkIn || "-"} / {record.checkOut || "-"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-50">
                <Button 
                  onClick={() => openEditModal(record)}
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1.5 text-blue-600 border-blue-100"
                >
                  <Edit2 size={14} /> Edit
                </Button>
                <Button 
                  onClick={() => deleteRecord(record._id)}
                  variant="outline" 
                  size="sm" 
                  className="h-8 gap-1.5 text-red-600 border-red-100"
                >
                  <Trash2 size={14} /> Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-card w-full max-w-md p-6 rounded-2xl shadow-xl border border-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingRecord ? 'Edit Record' : 'Add New Record'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Employee</Label>
                  <select
                    className="w-full p-2 bg-slate-50 border border-border rounded-lg"
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    required
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp._id} value={emp._id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <select
                      className="w-full p-2 bg-slate-50 border border-border rounded-lg"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                      <option value="Late">Late</option>
                      <option value="On Leave">On Leave</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Check In</Label>
                    <Input 
                      type="time" 
                      value={checkIn} 
                      onChange={(e) => setCheckIn(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Check Out</Label>
                    <Input 
                      type="time" 
                      value={checkOut} 
                      onChange={(e) => setCheckOut(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Notes (Optional)</Label>
                    <Input 
                      placeholder="Meeting late..."
                      value={notes} 
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingRecord ? 'Update Record' : 'Save Record'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
