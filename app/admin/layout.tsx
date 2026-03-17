"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-card border-b border-border flex items-center justify-between px-4 h-16">
        <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Awence Admin
        </h2>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar for Desktop */}
      <div className="hidden lg:block fixed top-0 left-0 h-full">
        <Sidebar />
      </div>

      {/* Sidebar for Mobile */}
      <div className={`lg:hidden fixed top-0 left-0 h-full z-40 transition-transform transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar onLinkClick={() => setIsSidebarOpen(false)} />
        <button onClick={() => setIsSidebarOpen(false)} className="absolute top-4 right-4 text-white p-2">
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-8 p-4 lg:p-8">{children}</main>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}
