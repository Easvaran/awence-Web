"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Save, 
  Loader2, 
  Layout, 
  ChevronRight,
  GripVertical
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface ServiceItem {
  _id?: string;
  name: string;
  iconName: string;
  color: string;
}

interface ServiceCategory {
  _id: string;
  title: string;
  items: ServiceItem[];
  className: string;
  titleColor: string;
  isDark: boolean;
  order: number;
}

const ICON_OPTIONS = [
  "Layers", "Framer", "ImageIcon", "PenTool", "Layout", "Code2", "Atom", "Globe", 
  "Smartphone", "Zap", "Database", "Server", "Cpu", "Flame", "Send", "Box", 
  "Cloud", "ShieldCheck", "Github", "CheckCircle2", "Monitor", "Workflow"
];

const COLOR_OPTIONS = [
  "text-purple-500", "text-blue-500", "text-blue-400", "text-orange-500", 
  "text-cyan-400", "text-yellow-400", "text-green-500", "text-orange-400", 
  "text-yellow-500", "text-red-500", "text-red-400", "text-slate-400", "text-white"
];

const CLASS_NAME_OPTIONS = [
  "lg:col-span-1 lg:row-span-1 bg-blue-600/10 border-blue-600/20",
  "lg:col-span-2 lg:row-span-1 bg-slate-900 border-slate-800",
  "lg:col-span-1 lg:row-span-1 bg-indigo-600/10 border-indigo-600/20",
];

export default function AdminServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [className, setClassName] = useState(CLASS_NAME_OPTIONS[0]);
  const [titleColor, setTitleColor] = useState("text-blue-600");
  const [isDark, setIsDark] = useState(false);
  const [items, setItems] = useState<ServiceItem[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      toast.error("Failed to load service categories");
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    setItems([...items, { name: "", iconName: "Layers", color: "text-blue-500" }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof ServiceItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || items.length === 0) {
      toast.error("Title and at least one item are required");
      return;
    }

    setSaving(true);
    try {
      const url = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          className,
          titleColor,
          isDark,
          items,
          order: categories.length // Simple order
        }),
      });

      if (res.ok) {
        toast.success(editingId ? "Category updated" : "Category added");
        resetForm();
        fetchCategories();
      } else {
        toast.error("Failed to save category");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setClassName(CLASS_NAME_OPTIONS[0]);
    setTitleColor("text-blue-600");
    setIsDark(false);
    setItems([]);
  };

  const handleEdit = (cat: ServiceCategory) => {
    setEditingId(cat._id);
    setTitle(cat.title);
    setClassName(cat.className);
    setTitleColor(cat.titleColor);
    setIsDark(cat.isDark);
    setItems(cat.items.map(i => ({ ...i })));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchCategories();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
    const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
    return <IconComponent className={className} size={20} />;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto p-4 sm:p-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Services Management</h1>
          <p className="text-slate-500">Customize the bento grid on your services page.</p>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
          {editingId ? "Edit Category" : "Add New Category"}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Category Title</Label>
              <Input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="e.g., App Development" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label>Layout Style</Label>
              <select 
                className="w-full p-2 border rounded-md"
                value={className}
                onChange={e => {
                  setClassName(e.target.value);
                  setIsDark(e.target.value.includes("bg-slate-900"));
                  setTitleColor(e.target.value.includes("bg-slate-900") ? "text-white" : "text-blue-600");
                }}
              >
                {CLASS_NAME_OPTIONS.map((opt, i) => (
                  <option key={i} value={opt}>{opt.includes("bg-slate-900") ? "Dark (Wide)" : "Light (Small)"}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-bold">Tech Items</Label>
              <Button type="button" onClick={addItem} size="sm" variant="outline" className="gap-2">
                <Plus size={16} /> Add Tech
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 relative">
                  <button 
                    type="button" 
                    onClick={() => removeItem(idx)}
                    className="absolute top-2 right-2 text-slate-400 hover:text-red-500"
                  >
                    <X size={14} />
                  </button>
                  <Input 
                    placeholder="Name (e.g., React)" 
                    value={item.name} 
                    onChange={e => updateItem(idx, "name", e.target.value)}
                    className="h-8 text-sm"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select 
                      className="text-xs p-1 border rounded bg-white"
                      value={item.iconName}
                      onChange={e => updateItem(idx, "iconName", e.target.value)}
                    >
                      {ICON_OPTIONS.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                    <select 
                      className="text-xs p-1 border rounded bg-white"
                      value={item.color}
                      onChange={e => updateItem(idx, "color", e.target.value)}
                    >
                      {COLOR_OPTIONS.map(color => (
                        <option key={color} value={color}>{color.replace("text-", "")}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" className="flex-1 gap-2" disabled={saving}>
              {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {editingId ? "Update Category" : "Save Category"}
            </Button>
            {editingId && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </div>

      {/* List Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <Loader2 className="animate-spin mx-auto text-primary" size={32} />
          </div>
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-dashed">
            No categories added yet. Start by adding one above.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between ${cat.className}`}>
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className={`text-xl font-bold ${cat.titleColor}`}>{cat.title}</h3>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(cat)} className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                      <Edit2 size={14} className={cat.isDark ? "text-white" : "text-slate-600"} />
                    </button>
                    <button onClick={() => deleteCategory(cat._id)} className="p-1.5 bg-white/10 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 size={14} className={cat.isDark ? "text-red-400" : "text-red-500"} />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {cat.items.map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${cat.isDark ? "bg-slate-800/50 border-slate-700 text-slate-200" : "bg-white border-blue-50 text-slate-700"}`}>
                      <DynamicIcon name={item.iconName} className={item.color} />
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
