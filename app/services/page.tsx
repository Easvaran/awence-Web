"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CTASection } from "@/components/home/cta-section";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { ChevronRight, CheckCircle2, Zap } from "lucide-react";

interface ServiceItem {
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
}

const DynamicIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <IconComponent className={className} size={20} />;
};

export default function ServicesPage() {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Failed to fetch service categories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 min-h-screen bg-slate-50/30">
        {/* Hero Section */}
        <section className="py-20 lg:py-32 bg-slate-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/30 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/30 blur-[120px] rounded-full"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                Our Tech Stack & Services
              </span>
              <h1 className="text-5xl lg:text-7xl font-bold text-white leading-tight mb-8">
                Innovating with the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Best Technologies</span>
              </h1>
              <p className="max-w-2xl mx-auto text-xl text-slate-400 leading-relaxed">
                We leverage cutting-edge tools and frameworks to build robust, scalable, and beautiful digital experiences for our clients.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Bento Grid Services Section */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {loading ? (
                <div className="col-span-full flex justify-center py-20">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                </div>
              ) : categories.length === 0 ? (
                <div className="col-span-full text-center py-20 bg-white rounded-3xl border">
                  <h3 className="text-xl font-bold text-slate-900">Services are being updated</h3>
                </div>
              ) : (
                categories.map((cat, idx) => (
                  <motion.div
                    key={cat._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`p-8 rounded-[2rem] border shadow-sm flex flex-col justify-between ${cat.className}`}
                  >
                    <div>
                      <h3 className={`text-2xl font-bold mb-8 ${cat.titleColor}`}>
                        {cat.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-4">
                        {cat.items.map((item, itemIdx) => (
                          <motion.div
                            key={itemIdx}
                            whileHover={{ scale: 1.05 }}
                            className={`flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all ${
                              cat.isDark 
                                ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-800 hover:border-slate-600" 
                                : "bg-white border-blue-100 hover:border-blue-200 shadow-sm"
                            }`}
                          >
                            <DynamicIcon name={item.iconName} className={`w-5 h-5 ${item.color}`} />
                            <span className={`text-sm font-bold ${cat.isDark ? "text-slate-200" : "text-slate-700"}`}>
                              {item.name}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    {cat.isDark && (
                      <div className="mt-12 flex justify-end">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Scrolling Tech Marquee Animation Placeholder / Visual */}
        <section className="py-20 bg-slate-950 overflow-hidden border-y border-slate-900">
          <div className="flex items-center gap-20 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-20">
                {categories.flatMap(c => c.items).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 text-slate-500 font-bold uppercase tracking-widest text-sm opacity-50 hover:opacity-100 transition-opacity cursor-default">
                    <DynamicIcon name={item.iconName} className="w-6 h-6" />
                    {item.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </section>

        <style jsx>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
            display: flex;
            width: fit-content;
          }
        `}</style>

        {/* Value Proposition */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-8">
                  We don't just write code. <br /> We build <span className="text-blue-600">Futures.</span>
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed mb-10">
                  Our team combines deep technical expertise with strategic thinking to deliver solutions that solve real-world problems and drive measurable growth.
                </p>
                <div className="space-y-6">
                  {[
                    "Custom software development tailored to your goals",
                    "Seamless integration with your existing workflows",
                    "Ongoing support and optimization for long-term success",
                    "Transparent communication and agile delivery",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-slate-700 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden shadow-2xl relative">
                  <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop')] bg-cover"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white max-w-xs text-center">
                      <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                      <p className="text-xl font-bold mb-2">High Performance</p>
                      <p className="text-sm text-white/70">Optimized for speed, security, and scalability from day one.</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-3xl shadow-xl border border-slate-100 p-6 hidden lg:block">
                  <p className="text-4xl font-bold text-blue-600 mb-1">99%</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}

