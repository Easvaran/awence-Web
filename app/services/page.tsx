"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CTASection } from "@/components/home/cta-section";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import { 
  ChevronRight, 
  CheckCircle2, 
  Zap,
  Headphones,
  FileText,
  BarChart3,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Database,
  FileCheck,
  Calculator,
  Users,
  TrendingUp,
  PieChart,
  Brain,
  Bot,
  Cloud,
  Shield,
  Workflow,
  Check
} from "lucide-react";

const oldServices = [
  {
    id: "customer-support",
    icon: Headphones,
    title: "Customer Support",
    description: "Deliver exceptional customer experiences with our comprehensive multi-channel support solutions.",
    features: [
      { icon: MessageSquare, title: "Live Chat Support", description: "Real-time assistance for your customers across web and mobile platforms." },
      { icon: Mail, title: "Email Management", description: "Efficient email handling with guaranteed response times and quality." },
      { icon: Phone, title: "Voice Support", description: "Professional inbound and outbound call center services." },
      { icon: Clock, title: "24/7 Availability", description: "Round-the-clock support in multiple languages and time zones." },
    ],
  },
  {
    id: "back-office",
    icon: FileText,
    title: "Back Office Processing",
    description: "Streamline your administrative operations and focus on strategic business growth.",
    features: [
      { icon: Database, title: "Data Entry & Management", description: "Accurate and efficient data entry with quality assurance protocols." },
      { icon: FileCheck, title: "Document Processing", description: "End-to-end document management, verification, and archival." },
      { icon: Calculator, title: "Accounting Support", description: "Bookkeeping, invoicing, and financial data processing services." },
      { icon: Users, title: "HR Administration", description: "Payroll processing, benefits administration, and employee records management." },
    ],
  },
  {
    id: "data-processing",
    icon: BarChart3,
    title: "Data Processing & Analytics",
    description: "Transform raw data into actionable insights that drive informed business decisions.",
    features: [
      { icon: TrendingUp, title: "Data Analytics", description: "Advanced analytics to uncover trends and opportunities in your data." },
      { icon: PieChart, title: "Business Intelligence", description: "Comprehensive BI solutions with custom dashboards and reporting." },
      { icon: Brain, title: "Predictive Modeling", description: "AI-powered predictions to anticipate market trends and customer behavior." },
      { icon: Database, title: "Data Warehousing", description: "Secure and scalable data storage and management solutions." },
    ],
  },
  {
    id: "digital-transformation",
    icon: Zap,
    title: "Digital Transformation",
    description: "Modernize your operations with cutting-edge technology and automation solutions.",
    features: [
      { icon: Bot, title: "Process Automation", description: "RPA solutions to automate repetitive tasks and improve efficiency." },
      { icon: Cloud, title: "Cloud Migration", description: "Seamless transition to cloud-based systems and infrastructure." },
      { icon: Shield, title: "Cybersecurity", description: "Comprehensive security solutions to protect your digital assets." },
      { icon: Workflow, title: "Workflow Optimization", description: "Streamlined processes that reduce bottlenecks and improve productivity." },
    ],
  },
];

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

        {/* Operational Services (Old Data) */}
        <section className="py-24 lg:py-32 bg-slate-100/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Our Operational Services</h2>
              <p className="text-lg text-slate-600">
                Beyond technology, we provide the essential operational support your business needs to thrive in a global market.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {oldServices.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-600">
                      <service.icon size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{service.title}</h3>
                  </div>
                  <p className="text-slate-600 mb-8">{service.description}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {service.features.map((feature, fIdx) => (
                      <div key={fIdx} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <feature.icon size={18} className="text-blue-500" />
                          <h4 className="font-bold text-slate-800 text-sm">{feature.title}</h4>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}

