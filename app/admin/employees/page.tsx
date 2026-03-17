"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Search, Filter, X, User, Mail, Shield, Calendar, Phone, Hash } from "lucide-react";
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
  role: string;
  department?: string;
  position?: string;
  manager?: string;
  age?: number;
  dob?: string;
  mobile?: string;
  isApproved: boolean;
  status: string;
  createdAt: string;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  // Form states
  const [employeeId, setEmployeeId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [position, setPosition] = useState("");
  const [manager, setManager] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState<string>("");
  const [dob, setDob] = useState("");
  const [mobile, setMobile] = useState("");
  const [isApproved, setIsApproved] = useState(false);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      if (Array.isArray(data)) {
        setEmployees(data);
      }
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingEmployee(null);
    setEmployeeId("");
    setName("");
    setEmail("");
    setDepartment("");
    setPosition("");
    setManager("");
    setPassword("");
    setAge("");
    setDob("");
    setMobile("");
    setIsApproved(false);
    setStatus("pending");
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    console.log("Opening edit modal for employee:", employee);
    setEditingEmployee(employee);
    setEmployeeId(employee.employeeId || "");
    setName(employee.name || "");
    setEmail(employee.email || "");
    setDepartment(employee.department || "");
    setPosition(employee.position || "");
    setManager(employee.manager || "");
    setPassword(""); // Don't show existing password
    setAge(employee.age !== undefined && employee.age !== null ? employee.age.toString() : "");
    setDob(employee.dob || "");
    setMobile(employee.mobile || "");
    setIsApproved(employee.isApproved || false);
    setStatus(employee.status || "pending");
    setIsModalOpen(true);
  };

  const handleApprove = async (employee: Employee, approve: boolean) => {
    try {
      const res = await fetch(`/api/employees/${employee._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...employee,
          isApproved: approve,
          status: approve ? "approved" : "rejected",
        }),
      });

      if (res.ok) {
        toast.success(approve ? "Employee approved" : "Employee rejected");
        fetchEmployees();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }

    const payload = {
      name,
      email,
      employeeId,
      department,
      position,
      manager,
      age: age ? parseInt(age) : undefined,
      dob,
      mobile,
      isApproved,
      status,
      ...(password ? { password } : {})
    };

    try {
      const url = editingEmployee ? `/api/employees/${editingEmployee._id}` : "/api/employees";
      const method = editingEmployee ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success(editingEmployee ? "Employee updated" : "Employee added");
        setIsModalOpen(false);
        fetchEmployees();
      } else {
        toast.error(data.error || "Failed to save employee");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const deleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee? This will remove all their records.")) return;
    try {
      const res = await fetch(`/api/employees/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Employee removed");
        fetchEmployees();
      }
    } catch (error) {
      toast.error("Failed to remove employee");
    }
  };

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Employees Management</h1>
          <p className="text-muted-foreground mt-1">Manage and track your organization's personnel.</p>
        </div>
        <Button onClick={openAddModal} className="gap-2">
          <Plus size={18} /> Add Employee
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            placeholder="Search by name or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter size={18} /> Filter
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-muted-foreground">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="inline-block mb-4"
            >
              <Shield size={40} className="text-primary/20" />
            </motion.div>
            <p>Loading your team...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="col-span-full py-20 text-center text-muted-foreground border border-dashed rounded-xl">
            <User size={40} className="mx-auto mb-4 opacity-20" />
            <p>No employees found matching your search.</p>
          </div>
        ) : (
          filteredEmployees.map((emp) => (
            <motion.div
              key={emp._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex flex-col">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl mb-1">
                    {emp.name.charAt(0)}
                  </div>
                  {emp.employeeId && (
                    <span className="text-[10px] font-mono text-muted-foreground bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                      {emp.employeeId}
                    </span>
                  )}
                </div>
                <div className="flex gap-2 items-start">
                  {emp.status === "pending" && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                        onClick={() => handleApprove(emp, true)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleApprove(emp, false)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  <button
                    onClick={() => openEditModal(emp)}
                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => deleteEmployee(emp._id)}
                    className="p-2 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold truncate">{emp.name}</h3>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail size={14} className="shrink-0" />
                  <span className="truncate">{emp.email}</span>
                </div>
                {emp.mobile && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone size={14} className="shrink-0" />
                    <span>{emp.mobile}</span>
                  </div>
                )}
                {(emp.age || emp.dob) && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {emp.age && (
                      <div className="flex items-center gap-1">
                        <Hash size={14} />
                        <span>{emp._id.includes('temp') ? 'N/A' : emp.age} yrs</span>
                      </div>
                    )}
                    {emp.dob && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{emp.dob}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Shield size={12} />
                  <span>Role: {emp.role.charAt(0).toUpperCase() + emp.role.slice(1)}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  emp.status === 'approved' ? 'bg-green-100 text-green-700' :
                  emp.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {emp.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card w-full max-w-md p-6 rounded-2xl shadow-xl border border-border"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                    <Input
                      placeholder="Enter full name"
                      className="pl-10"
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 text-muted-foreground" size={18} />
                    <Input
                      placeholder="e.g. AWN-001"
                      className="pl-10 font-mono"
                      autoComplete="off"
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input
                      placeholder="e.g. Sales"
                      className="bg-slate-50"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Position</Label>
                    <Input
                      placeholder="e.g. Executive"
                      className="bg-slate-50"
                      value={position}
                      onChange={(e) => setPosition(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Supervisor/Manager</Label>
                  <Input
                    placeholder="Enter manager name"
                    className="bg-slate-50"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-3 text-muted-foreground" size={18} />
                      <Input
                        type="number"
                        placeholder="Age"
                        className="pl-10"
                        autoComplete="off"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-muted-foreground" size={18} />
                      <Input
                        type="date"
                        className="pl-10"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 text-muted-foreground" size={18} />
                    <Input
                      type="tel"
                      placeholder="Mobile number"
                      className="pl-10"
                      autoComplete="off"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="pl-10"
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{editingEmployee ? 'Update Password (Optional)' : 'Initial Password'}</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 text-muted-foreground" size={18} />
                    <Input
                      type="password"
                      placeholder={editingEmployee ? "Leave blank to keep current" : "Enter password"}
                      className="pl-10"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required={!editingEmployee}
                    />
                  </div>
                  {editingEmployee && (
                    <p className="text-[10px] text-muted-foreground mt-1 px-1 italic">
                      Passwords are encrypted for security and cannot be viewed. Enter a new one to reset it.
                    </p>
                  )}
                </div>

                <div className="pt-6 flex gap-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingEmployee ? 'Update Profile' : 'Add Employee'}
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
