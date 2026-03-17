"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { Star, MessageSquare, Quote, User, Calendar } from "lucide-react";

interface Review {
  _id: string;
  projectId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface Project {
  _id: string;
  projectName: string;
}

export default function PublicReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
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
      console.error("Failed to fetch reviews:", error);
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
                Wall of Love
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight"
              >
                What Our Clients <br />Are Saying
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-xl text-primary-foreground/70 leading-relaxed max-w-2xl"
              >
                Real feedback from our partners across the globe. We pride ourselves on delivering excellence and building long-lasting relationships.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Reviews Grid */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 lg:p-24 border border-slate-200 text-center shadow-sm">
                <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">No reviews yet</h3>
                <p className="text-slate-500 max-w-lg mx-auto text-lg">
                  We're just getting started with our new review system. Check back soon to see what our clients have to say!
                </p>
              </div>
            ) : (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                {reviews.map((review, index) => (
                  <motion.div
                    key={review._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="break-inside-avoid bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
                  >
                    <Quote className="absolute top-6 right-8 w-10 h-10 text-primary/5 group-hover:text-primary/10 transition-colors" />
                    
                    <div className="flex items-center gap-1 mb-6">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          size={16} 
                          className={star <= review.rating ? "fill-amber-500 text-amber-500" : "text-slate-200"} 
                        />
                      ))}
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-8 italic relative z-10">
                      "{review.comment || "Great work! We are very satisfied with the results."}"
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-50 pt-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {review.userName[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{review.userName}</p>
                          <p className="text-[10px] text-primary uppercase tracking-widest font-bold mt-0.5">
                            {projects[review.projectId] || "Project Partner"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                        <Calendar size={12} />
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 -skew-x-12 translate-x-1/2"></div>
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to experience our world-class service?</h2>
              <p className="text-slate-400 text-lg mb-10">
                Join our list of satisfied partners and let's build something amazing together.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/contact" 
                  className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Work With Us
                </a>
                <a 
                  href="/projects" 
                  className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
                >
                  View Our Portfolio
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
