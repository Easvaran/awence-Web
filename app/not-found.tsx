"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, Ghost } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        {/* Animated Character/Icon */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative mb-8"
        >
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "easeInOut" 
            }}
            className="inline-block"
          >
            <div className="bg-white p-8 rounded-full shadow-xl border border-slate-100 relative">
              <Ghost size={80} className="text-primary" />
              {/* Animated Eyes */}
              <motion.div 
                className="absolute top-[45px] left-[45px] flex gap-4"
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ duration: 0.2, repeat: Infinity, repeatDelay: 3 }}
              >
                <div className="w-2 h-2 bg-slate-800 rounded-full" />
                <div className="w-2 h-2 bg-slate-800 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
          
          {/* Floating Particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary/20 rounded-full w-4 h-4"
              animate={{
                y: [-20, -100],
                x: [0, (i - 1) * 30],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.6,
                ease: "easeOut"
              }}
              style={{
                left: '50%',
                top: '50%',
              }}
            />
          ))}
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-8xl font-bold text-slate-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">Page Not Found</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off into the digital void. 
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="default" size="lg" className="gap-2">
              <Link href="/">
                <Home size={18} />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <Link href="/contact">
                <Search size={18} />
                Contact Support
              </Link>
            </Button>
          </div>
        </motion.div>

        {/* Search Suggestion */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-12 text-sm text-slate-400"
        >
          Lost? Try navigating through our main menu or check your URL.
        </motion.p>
      </div>
    </div>
  );
}
