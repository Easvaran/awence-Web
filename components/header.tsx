"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Settings, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  _id: string;
  name: string;
  label: string;
  href: string;
  isVisible: boolean;
  order: number;
}

export function Header() {
  const { data: session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<NavLink[]>([]);

  useEffect(() => {
    fetchNavLinks();
  }, []);

  const fetchNavLinks = async () => {
    try {
      const res = await fetch("/api/admin/nav-settings");
      const data = await res.json();
      if (res.ok) {
        // Only show visible links
        setNavLinks(data.filter((link: NavLink) => link.isVisible));
      }
    } catch (error) {
      console.error("Failed to fetch nav links:", error);
    }
  };

  const user = session?.user as any;
  const dashboardHref = user?.role === "admin" ? "/admin" : "/employee/dashboard";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <nav className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Admin Entry */}
          <Link href="/login?role=admin" className="flex items-center gap-2 group cursor-pointer">
            <div className="relative h-25 lg:h-20 w-32 lg:w-40 transition-transform group-hover:scale-105 active:scale-95">
              <Image
                src="/images/logo.png"
                alt="Awence"
                fill
                className="object-contain mix-blend-multiply"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link._id}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {session ? (
              <Button asChild variant="outline" className="gap-2">
                <Link href={dashboardHref}>
                  <User size={16} />
                  {user?.role === "admin" ? "Admin Panel" : "Employee Portal"}
                </Link>
              </Button>
            ) : (
              <Button asChild variant="ghost">
                <Link href="/login?role=employee">Login</Link>
              </Button>
            )}
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 -mr-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden py-4 border-t border-border overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link._id}
                    href={link.href}
                    className="text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-border pt-4 mt-2 flex flex-col gap-4">
                  {session ? (
                    <Button asChild variant="outline" className="w-full justify-center gap-2">
                      <Link href={dashboardHref} onClick={() => setMobileMenuOpen(false)}>
                        <User size={16} />
                        {user?.role === "admin" ? "Admin Panel" : "Employee Portal"}
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild variant="outline" className="w-full justify-center">
                      <Link href="/login?role=employee" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    </Button>
                  )}
                  <Button asChild className="w-full">
                    <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Get in Touch</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
