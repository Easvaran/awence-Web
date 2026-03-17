"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarCheck, Settings, LogOut, UserRound, Image as ImageIcon, FolderKanban, Star, GraduationCap } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Attendance", icon: CalendarCheck, href: "/admin/attendance" },
  { name: "Employees", icon: Users, href: "/admin/employees" },
  { name: "Clients", icon: UserRound, href: "/admin/clients" },
  { name: "Clients Visit", icon: ImageIcon, href: "/admin/clients-visit" },
  { name: "Projects", icon: FolderKanban, href: "/admin/projects" },
  { name: "Reviews", icon: Star, href: "/admin/reviews" },
  { name: "Courses", icon: GraduationCap, href: "/admin/courses" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

interface SidebarProps {
  onLinkClick?: () => void;
}

export default function Sidebar({ onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (onLinkClick) {
      onLinkClick();
    }
  };

  return (
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          Awence Admin
        </h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isActive && "bg-primary/10 text-primary font-medium"
              )}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <button
          onClick={() => {
            handleLinkClick();
            signOut({ callbackUrl: "/" });
          }}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
