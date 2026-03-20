"use client";

import React, { useState, useEffect } from "react";
import { Upload, Trash2, Search, Loader2, Image as ImageIcon, ExternalLink, FolderKanban, Star, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  _id: string;
  projectName: string;
  image: string;
  description: string;
  displaySize: number;
  category?: string;
  link?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

interface Review {
  _id: string;
  projectId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

function ProjectReviewsAdmin({ projectId }: { projectId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [projectId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?projectId=${projectId}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setReviews(data);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Review deleted");
        fetchReviews();
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (loading) return <div className="p-4 text-center text-xs text-slate-400">Loading reviews...</div>;
  if (reviews.length === 0) return <div className="p-4 text-center text-xs text-slate-400 italic">No reviews yet for this project.</div>;

  return (
    <div className="p-4 space-y-3 bg-slate-50/50 rounded-xl mt-2 border border-slate-100">
      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">User Reviews ({reviews.length})</h4>
      <div className="grid gap-3">
        {reviews.map((review) => (
          <div key={review._id} className="flex items-start justify-between bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">{review.userName}</span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={10} 
                      className={star <= review.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"} 
                    />
                  ))}
                </div>
              </div>
              {review.comment && <p className="text-xs text-slate-600 italic">"{review.comment}"</p>}
              <p className="text-[10px] text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-red-400 hover:text-red-600 hover:bg-red-50"
              onClick={() => deleteReview(review._id)}
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  
  // Form state
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displaySize, setDisplaySize] = useState(300);
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [status, setStatus] = useState("Shipped");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (error) {
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("File size exceeds 2MB. Please use a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName || !image) {
      toast.error("Project name and image are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName,
          image,
          description,
          displaySize,
          category,
          link,
          status,
          startDate,
          endDate,
        }),
      });

      if (res.ok) {
        toast.success("Project added successfully");
        setProjectName("");
        setDescription("");
        setImage("");
        setDisplaySize(300);
        setCategory("");
        setLink("");
        setStatus("Shipped");
        setStartDate("");
        setEndDate("");
        fetchProjects();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to add project");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchProjects();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Projects Management</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Showcase your best work on the public projects page.</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Upload size={20} className="text-primary" />
          Add New Project
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectName">Project Name</Label>
              <Input
                id="projectName"
                placeholder="Awesome Web App..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="Web Development, AI, etc."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="link">Project Link (Optional)</Label>
              <Input
                id="link"
                placeholder="https://example.com"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="displaySize">Display Size (Pixels)</Label>
              <Input
                id="displaySize"
                type="number"
                min="100"
                max="800"
                value={displaySize}
                onChange={(e) => setDisplaySize(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="Shipped">Shipped</option>
                <option value="WIP">WIP</option>
                <option value="RIP">RIP</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Project Image / Screenshot</Label>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden group">
              <input
                type="file"
                id="image"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleImageUpload}
              />
              {image ? (
                <div className="relative w-full flex justify-center">
                  <img src={image} alt="Preview" className="max-h-60 object-contain rounded-lg shadow-md" style={{ width: `min(100%, ${displaySize / 2}px)` }} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white text-sm font-medium">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <ImageIcon size={32} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Click or drag to upload project image</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP (Max 2MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about this project..."
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full gap-2 py-4 sm:py-6 text-base sm:text-lg" disabled={saving || !image}>
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            Create Project Entry
          </Button>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-12">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-xl font-bold">Live Projects</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
            {projects.length} Total
          </span>
        </div>
        
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700 w-10"></th>
                <th className="p-4 font-semibold text-slate-700">Preview</th>
                <th className="p-4 font-semibold text-slate-700">Project Details</th>
                <th className="p-4 font-semibold text-slate-700">Category</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary/40" />
                    Loading project data...
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">No projects created yet.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <React.Fragment key={project._id}>
                    <tr className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-0 h-8 w-8"
                          onClick={() => setExpandedProject(expandedProject === project._id ? null : project._id)}
                        >
                          {expandedProject === project._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </Button>
                      </td>
                      <td className="p-4">
                        <img src={project.image} alt={project.projectName} className="h-16 w-24 object-cover rounded-lg shadow-sm border border-slate-200" />
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{project.projectName}</p>
                        {project.link && (
                          <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline">
                            <ExternalLink size={10} /> Visit Link
                          </a>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                          {project.category || "General"}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteProject(project._id)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </td>
                    </tr>
                    <AnimatePresence>
                      {expandedProject === project._id && (
                        <tr>
                          <td colSpan={5} className="p-0 bg-slate-50/30">
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-4 px-12">
                                <ProjectReviewsAdmin projectId={project._id} />
                              </div>
                            </motion.div>
                          </td>
                        </tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-100">
          {loading ? (
            <div className="p-12 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary/40" />
              Loading...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No projects found.</div>
          ) : (
            projects.map((project) => (
              <div key={project._id} className="p-4 space-y-4">
                <div className="flex gap-4">
                  <img src={project.image} alt={project.projectName} className="h-20 w-1/3 object-cover rounded-lg shadow-sm border border-slate-200 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate">{project.projectName}</p>
                    <div className="mt-1">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded uppercase">
                        {project.category || "General"}
                      </span>
                    </div>
                    {project.link && (
                      <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-xs text-primary flex items-center gap-1 mt-2 hover:underline">
                        <ExternalLink size={10} /> Visit Link
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 gap-1.5 text-slate-600 text-xs"
                    onClick={() => setExpandedProject(expandedProject === project._id ? null : project._id)}
                  >
                    {expandedProject === project._id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expandedProject === project._id ? 'Hide Reviews' : 'Show Reviews'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteProject(project._id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>

                <AnimatePresence>
                  {expandedProject === project._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-slate-50/50 rounded-xl mt-2"
                    >
                      <div className="p-2">
                        <ProjectReviewsAdmin projectId={project._id} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
