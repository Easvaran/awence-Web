'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';

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

export default function ShowcasePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20 min-h-screen bg-slate-50/30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Content Showcase</h1>
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
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
                    <div className="flex items-center text-sm text-slate-500 mb-4">
                      <span>{project.status}</span>
                      <span className="mx-2">·</span>
                      <span>
                        {project.startDate && new Date(project.startDate).toLocaleDateString()} -
                        {project.endDate && new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.category?.split(',').map((cat) => (
                        <span key={cat} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                          {cat.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
