"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, User, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

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

function ProjectReviewSection({ projectId }: { projectId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  // Form state
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !rating) {
      toast.error("Please provide your name and a rating");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          userName,
          rating,
          comment,
        }),
      });

      if (res.ok) {
        toast.success("Review submitted successfully!");
        setUserName("");
        setComment("");
        setRating(5);
        setShowForm(false);
        fetchReviews();
      } else {
        toast.error("Failed to submit review");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="mt-8 pt-8 border-t border-slate-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h4 className="text-lg font-bold text-slate-900">Reviews ({reviews.length})</h4>
          {averageRating && (
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-1 rounded-lg text-sm font-bold">
              <Star size={14} className="fill-amber-500 text-amber-500" />
              {averageRating}
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.form
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleSubmit}
            className="mb-8 p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Your Name</label>
                <Input 
                  placeholder="John Doe" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Rating</label>
                <div className="flex gap-2 h-10 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform active:scale-90"
                    >
                      <Star 
                        size={24} 
                        className={star <= rating ? "fill-amber-500 text-amber-500" : "text-slate-300"} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Your Comment</label>
              <Textarea 
                placeholder="Share your thoughts on this project..." 
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full gap-2" disabled={submitting}>
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              Submit Review
            </Button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-center py-4 text-slate-400 text-sm">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-4 text-slate-400 text-sm italic">No reviews yet. Be the first to review!</div>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                    {review.userName[0].toUpperCase()}
                  </div>
                  <span className="font-bold text-slate-900 text-sm">{review.userName}</span>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={12} 
                      className={star <= review.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"} 
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{review.comment}"
                </p>
              )}
              <p className="text-[10px] text-slate-400 mt-2">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Failed to fetch projects:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 min-h-screen bg-slate-50/30">
        {/* Hero Section */}
        <section className="py-16 lg:py-24 bg-foreground relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:30px_30px]"></div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60 mb-6"
              >
                Our Portfolio
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight"
              >
                Delivering Excellence <br />Across Every Project
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-xl text-primary-foreground/70 leading-relaxed max-w-2xl"
              >
                Explore our successful track record of digital transformation and operational optimization for businesses worldwide.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Projects Grid Section */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : projects.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 lg:p-24 border border-slate-200 text-center shadow-sm">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Our portfolio is being updated</h3>
                <p className="text-slate-500 max-w-lg mx-auto text-lg">
                  We are currently preparing case studies of our latest projects. Please check back soon to see our work.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-lg shadow-md overflow-hidden group"
                  >
                    <div className="relative aspect-[4/3]">
                      <img
                        src={project.image}
                        alt={project.projectName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h2 className="text-xl font-bold text-slate-900 mb-2">{project.projectName}</h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.category?.split(',').map((cat) => (
                          <span key={cat} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                            {cat.trim()}
                          </span>
                        ))}
                      </div>
                      
                      {project.description && (
                        <p className="text-sm text-slate-600 mb-6 line-clamp-3">
                          {project.description}
                        </p>
                      )}

                      {/* Review Section */}
                      <ProjectReviewSection projectId={project._id} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 bg-primary">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">Have a project in mind?</h2>
            <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-12">
              Let's collaborate to bring your vision to life with our expert TECH and BPO solutions.
            </p>
            <a 
              href="/contact" 
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-slate-50 transition-colors shadow-xl"
            >
              Start a Conversation
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
