"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { motion } from "framer-motion";

interface ClientVisit {
  _id: string;
  clientName: string;
  logo: string;
  visitDate: string;
  description: string;
  displaySize: number;
}

export default function ClientsPage() {
  const [visits, setVisits] = useState<ClientVisit[]>([]);
  const [loading, setLoading] = useState(true);

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
      console.error("Failed to fetch client visits:", error);
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
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]"></div>
          
          <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60 mb-6"
              >
                Our Trusted Partners
              </motion.p>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl lg:text-6xl font-bold text-primary-foreground leading-tight tracking-tight"
              >
                Empowering Innovation <br />Through Collaboration
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 text-xl text-primary-foreground/70 leading-relaxed max-w-2xl"
              >
                We take pride in working with industry leaders worldwide, delivering tailored BPO solutions that drive efficiency and sustainable growth.
              </motion.p>
            </div>
          </div>
        </section>

        {/* Client Logos Section */}
        <section className="py-24 lg:py-32">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Client Portfolio</h2>
              <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              </div>
            ) : visits.length === 0 ? (
              <div className="bg-white rounded-3xl p-16 lg:p-24 border border-slate-200 text-center shadow-sm">
                <h3 className="text-2xl font-semibold text-slate-900 mb-4">Our partnerships are growing</h3>
                <p className="text-slate-500 max-w-lg mx-auto text-lg">
                  We are currently updating our client portfolio. Check back soon to see the latest global companies we've partnered with.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12 lg:gap-16 items-center justify-items-center">
                {visits.map((visit, index) => (
                  <motion.div
                    key={visit._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative flex flex-col items-center"
                  >
                    <div className="relative p-8 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex items-center justify-center overflow-hidden">
                      <img
                        src={visit.logo}
                        alt={visit.clientName}
                        className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                        style={{ width: `${visit.displaySize}px`, height: 'auto' }}
                      />
                      
                      {/* Hover Overlay with info */}
                      {visit.description && (
                        <div className="absolute inset-0 bg-primary/95 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-center items-center text-center">
                          <p className="text-primary-foreground font-bold text-lg mb-2">{visit.clientName}</p>
                          <p className="text-primary-foreground/90 text-sm line-clamp-3">{visit.description}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <p className="text-slate-900 font-bold group-hover:text-primary transition-colors">{visit.clientName}</p>
                      <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest font-medium">Partner since {new Date(visit.visitDate).getFullYear()}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Success Metrics Section */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <p className="text-5xl font-bold text-primary mb-4">98%</p>
                <h4 className="text-xl font-semibold mb-2">Client Retention</h4>
                <p className="text-slate-400">Long-term partnerships built on trust and consistent delivery.</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-primary mb-4">40+</p>
                <h4 className="text-xl font-semibold mb-2">Countries Served</h4>
                <p className="text-slate-400">Global reach with localized expertise for enterprise clients.</p>
              </div>
              <div>
                <p className="text-5xl font-bold text-primary mb-4">15+</p>
                <h4 className="text-xl font-semibold mb-2">Years Experience</h4>
                <p className="text-slate-400">Deep industry knowledge and proven BPO methodology.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
