"use client";

import { useState, useEffect } from "react";
import { Star, Trash2, Loader2, MessageSquare, User, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  _id: string;
  projectId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  projectName?: string; // We'll fetch this separately or populate
}

interface Project {
  _id: string;
  projectName: string;
}

export default function ReviewsAdminPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch reviews and projects in parallel
      const [reviewsRes, projectsRes] = await Promise.all([
        fetch("/api/reviews"),
        fetch("/api/admin/projects")
      ]);

      const reviewsData = await reviewsRes.json();
      const projectsData = await projectsRes.json();

      if (Array.isArray(projectsData)) {
        const projectMap: Record<string, string> = {};
        projectsData.forEach((p: Project) => {
          projectMap[p._id] = p.projectName;
        });
        setProjects(projectMap);
      }

      if (Array.isArray(reviewsData)) {
        setReviews(reviewsData);
      }
    } catch (error) {
      toast.error("Failed to load reviews data");
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to delete this review?")) return;

    try {
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Review deleted successfully");
        setReviews(reviews.filter(r => r._id !== id));
      } else {
        toast.error("Failed to delete review");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Global Reviews Management</h1>
        <p className="text-slate-500 mt-1 text-sm sm:text-base">Monitor and manage all user reviews across all projects.</p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold">All User Feedback</h2>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
            {reviews.length} Total
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700">User</th>
                <th className="p-4 font-semibold text-slate-700">Project</th>
                <th className="p-4 font-semibold text-slate-700">Rating</th>
                <th className="p-4 font-semibold text-slate-700">Comment</th>
                <th className="p-4 font-semibold text-slate-700">Date</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary/40" />
                    Loading reviews...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">No reviews found.</td>
                </tr>
              ) : (
                <AnimatePresence>
                  {reviews.map((review) => (
                    <motion.tr
                      key={review._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                            {review.userName[0].toUpperCase()}
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{review.userName}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-slate-700">
                            {projects[review.projectId] || "Unknown Project"}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">{review.projectId}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              size={14} 
                              className={star <= review.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"} 
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600 max-w-xs line-clamp-2" title={review.comment}>
                          {review.comment || <span className="italic text-slate-400 text-xs">No comment provided</span>}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Calendar size={12} />
                          {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => deleteReview(review._id)}
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold">User Feedback</h2>
          <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-full uppercase tracking-wider">
            {reviews.length} Total
          </span>
        </div>
        
        {loading ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary/40" />
            Loading reviews...
          </div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 shadow-sm">
            No reviews found.
          </div>
        ) : (
          <AnimatePresence>
            {reviews.map((review) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold uppercase">
                      {review.userName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 leading-tight text-sm">{review.userName}</p>
                      <p className="text-[10px] text-slate-500 italic">{projects[review.projectId] || "Unknown Project"}</p>
                    </div>
                  </div>
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

                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl italic border border-slate-100">
                  {review.comment || <span className="text-slate-400">No comment provided</span>}
                </div>

                <div className="flex justify-between items-center pt-1">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                    <Calendar size={10} />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 gap-1.5 text-red-600 border-red-100 text-[10px]"
                    onClick={() => deleteReview(review._id)}
                  >
                    <Trash2 size={12} /> Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
