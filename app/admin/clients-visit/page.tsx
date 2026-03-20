"use client";

import { useState, useEffect } from "react";
import { Upload, Trash2, Search, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ClientVisit {
  _id: string;
  clientName: string;
  logo: string;
  visitDate: string;
  description: string;
  displaySize: number;
}

export default function ClientsVisitAdmin() {
  const [visits, setVisits] = useState<ClientVisit[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [clientName, setClientName] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState("");
  const [displaySize, setDisplaySize] = useState(150);
  const [visitDate, setVisitDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    fetchVisits();
  }, []);

  const fetchVisits = async () => {
    try {
      const res = await fetch("/api/admin/clients-visit");
      const data = await res.json();
      if (Array.isArray(data)) {
        setVisits(data);
      }
    } catch (error) {
      toast.error("Failed to load client visits");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for Base64 in DB
        toast.error("File size exceeds 1MB. Please use a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !logo) {
      toast.error("Client name and logo are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/clients-visit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          logo,
          description,
          displaySize,
          visitDate,
        }),
      });

      if (res.ok) {
        toast.success("Client visit added successfully");
        setClientName("");
        setDescription("");
        setLogo("");
        setDisplaySize(150);
        fetchVisits();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to add client visit");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const deleteVisit = async (id: string) => {
    if (!confirm("Are you sure you want to delete this record?")) return;

    try {
      const res = await fetch(`/api/admin/clients-visit/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchVisits();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Clients Visit Management</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Manage images and information for client visits displayed on the public page.</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
        <h2 className="text-lg sm:text-xl font-bold mb-6 flex items-center gap-2">
          <Upload size={20} className="text-primary" />
          Add New Client Visit
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="clientName">Client Name</Label>
            <Input
              id="clientName"
              placeholder="Enter client name..."
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="visitDate">Visit Date</Label>
              <Input
                id="visitDate"
                type="date"
                value={visitDate}
                onChange={(e) => setVisitDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displaySize">Logo Size (Pixels)</Label>
              <Input
                id="displaySize"
                type="number"
                min="50"
                max="400"
                value={displaySize}
                onChange={(e) => setDisplaySize(Number(e.target.value))}
              />
              <p className="text-[10px] text-slate-400">Controls logo size on the public page (50px to 400px).</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Client Logo / Visit Image</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden group">
              <input
                type="file"
                id="logo"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleImageUpload}
              />
              {logo ? (
                <div className="relative w-full flex justify-center">
                  <img src={logo} alt="Preview" className="max-h-40 object-contain rounded-lg shadow-sm" style={{ width: `min(100%, ${displaySize}px)` }} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white text-sm font-medium">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-slate-100">
                    <ImageIcon size={24} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Click or drag to upload logo</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, SVG (Max 1MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Short Description (Optional)</Label>
            <Input
              id="description"
              placeholder="E.g., Global partnership launch..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full gap-2 py-4 sm:py-6 text-base sm:text-lg" disabled={saving || !logo}>
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            Upload Client Visit
          </Button>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-12">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg sm:text-xl font-bold">Existing Client Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700">Logo</th>
                <th className="p-4 font-semibold text-slate-700">Client</th>
                <th className="p-4 font-semibold text-slate-700 text-center">Size</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">Loading records...</td>
                </tr>
              ) : visits.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No client visits recorded yet.</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {visits.map((visit) => (
                    <motion.tr
                      key={visit._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <img src={visit.logo} alt={visit.clientName} className="h-12 object-contain rounded" style={{ width: `${visit.displaySize / 3}px` }} />
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-slate-900">{visit.clientName}</p>
                        <p className="text-xs text-slate-500">{new Date(visit.visitDate).toLocaleDateString()}</p>
                      </td>
                      <td className="p-4 text-center text-sm text-slate-500">
                        {visit.displaySize}px
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteVisit(visit._id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
