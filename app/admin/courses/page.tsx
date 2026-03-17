"use client";

import React, { useState, useEffect } from "react";
import { Upload, Trash2, Loader2, Image as ImageIcon, BookOpen, Clock, User, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Course {
  _id: string;
  title: string;
  image: string;
  description: string;
  displaySize: number;
  price?: string;
  duration?: string;
  instructor?: string;
}

export default function CoursesAdmin() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [displaySize, setDisplaySize] = useState(300);
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [instructor, setInstructor] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
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
    if (!title || !image) {
      toast.error("Course title and image are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          image,
          description,
          displaySize,
          price,
          duration,
          instructor,
        }),
      });

      if (res.ok) {
        toast.success("Course added successfully");
        setTitle("");
        setDescription("");
        setImage("");
        setDisplaySize(300);
        setPrice("");
        setDuration("");
        setInstructor("");
        fetchCourses();
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to add course");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      const res = await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchCourses();
      } else {
        toast.error("Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Courses Management</h1>
        <p className="text-slate-500 mt-1">Add and manage training courses for your platform.</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Upload size={20} className="text-primary" />
          Add New Course
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                placeholder="Advanced BPO Training..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructor">Instructor</Label>
              <Input
                id="instructor"
                placeholder="John Doe"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                placeholder="Free / $99"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                placeholder="4 Weeks / 20 Hours"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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

          <div className="space-y-2">
            <Label htmlFor="image">Course Thumbnail / Banner</Label>
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
                  <img src={image} alt="Preview" className="max-h-60 object-contain rounded-lg shadow-md" style={{ width: `${displaySize / 2}px` }} />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-lg">
                    <p className="text-white text-sm font-medium">Click to change</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                    <ImageIcon size={32} className="text-slate-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">Click or drag to upload course image</p>
                  <p className="text-xs text-slate-400 mt-1">PNG, JPG, WebP (Max 2MB)</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed overview of the course curriculum..."
              className="min-h-[100px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full gap-2 py-6 text-lg" disabled={saving || !image}>
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
            Add Course to Platform
          </Button>
        </form>
      </div>

      {/* List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mt-12">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-xl font-bold">Available Courses</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
            {courses.length} Total
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700">Banner</th>
                <th className="p-4 font-semibold text-slate-700">Course Info</th>
                <th className="p-4 font-semibold text-slate-700">Details</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary/40" />
                    Loading course data...
                  </td>
                </tr>
              ) : courses.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center text-slate-500">No courses added yet.</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {courses.map((course) => (
                    <motion.tr
                      key={course._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <img src={course.image} alt={course.title} className="h-16 w-24 object-cover rounded-lg shadow-sm border border-slate-200" />
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{course.title}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <User size={12} /> {course.instructor || "Anonymous"}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <DollarSign size={12} /> {course.price || "Free"}
                          </span>
                          <span className="text-xs text-slate-600 flex items-center gap-1">
                            <Clock size={12} /> {course.duration || "Self-paced"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteCourse(course._id)}
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
