"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";
import { BookOpen, Clock, User, DollarSign, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Failed to fetch courses:", error);
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
                Upskill Your Team
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight"
              >
                World-Class Training <br />for Global BPO Excellence
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-xl text-primary-foreground/70 leading-relaxed max-w-2xl"
              >
                Unlock your potential with our specialized training programs designed to master communication, technical support, and customer success.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Courses Grid Section */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : courses.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 lg:p-24 border border-slate-200 text-center shadow-sm">
                <BookOpen className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Training curriculum coming soon</h3>
                <p className="text-slate-500 max-w-lg mx-auto text-lg">
                  We are currently finalizing our next wave of specialized BPO and Tech courses. Stay tuned for updates!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course, index) => (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                  >
                    <div className="relative aspect-video overflow-hidden bg-slate-100">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        style={{ maxWidth: `${course.displaySize * 2}px`, margin: '0 auto' }}
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                        {course.price || "Free"}
                      </div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col">
                      <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          {course.duration || "Self-paced"}
                        </div>
                        <div className="flex items-center gap-1">
                          <User size={14} />
                          {course.instructor || "Expert Trainer"}
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-8">
                        {course.description}
                      </p>

                      <div className="mt-auto">
                        <Button className="w-full gap-2 rounded-xl py-6 font-bold" variant="outline">
                          Course Details <ArrowRight size={18} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Feature Section */}
        <section className="py-24 bg-slate-100">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="text-primary" size={32} />
                </div>
                <h4 className="text-lg font-bold mb-3">Expert Curriculum</h4>
                <p className="text-slate-500 text-sm">Courses designed by industry veterans with decades of BPO experience.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <Clock className="text-primary" size={32} />
                </div>
                <h4 className="text-lg font-bold mb-3">Flexible Learning</h4>
                <p className="text-slate-500 text-sm">Access training modules 24/7 from anywhere in the world at your own pace.</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="text-primary" size={32} />
                </div>
                <h4 className="text-lg font-bold mb-3">Certification</h4>
                <p className="text-slate-500 text-sm">Receive industry-recognized certificates upon successful course completion.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import { GraduationCap } from "lucide-react";
