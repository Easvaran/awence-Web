"use client";

import { useState, useEffect } from "react";
import { Users, CalendarCheck, Clock, TrendingUp, ArrowRight, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from "sonner";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    lateToday: 0,
    onLeave: 0,
    weeklyData: [] as any[]
  });
  const [loading, setLoading] = useState(true);
  const [lastCheckInCount, setLastCheckInCount] = useState<number>(0);

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivity();
    
    // Set up real-time polling for notifications
    const interval = setInterval(() => {
      fetchDashboardStats(true);
      fetchRecentActivity(true);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardStats = async (isPolling = false) => {
    try {
      const res = await fetch("/api/dashboard/stats");
      const data = await res.json();
      if (res.ok) {
        if (isPolling && data.lateToday > stats.lateToday) {
          showNotification("Late Arrival Alert", `${data.lateToday - stats.lateToday} new employee(s) arrived late.`);
        }
        setStats(data);
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      if (!isPolling) setLoading(false);
    }
  };

  const fetchRecentActivity = async (isPolling = false) => {
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const latestActivities = data.slice(0, 5);
        
        if (isPolling && data.length > lastCheckInCount) {
          const newActivity = data[0]; // Assuming first is newest
          if (newActivity.status === "Present" || newActivity.status === "Late") {
            showNotification(
              newActivity.status === "Late" ? "Late Arrival" : "Employee Check-in",
              `${newActivity.employeeId?.name || "An employee"} has checked in at ${newActivity.checkIn}.`
            );
          }
        }
        
        setRecentActivity(latestActivities);
        setLastCheckInCount(data.length);
      }
    } catch (error) {
      console.error("Recent Activity Error:", error);
    }
  };

  const showNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body,
        icon: "/favicon.ico",
        tag: "attendance-alert"
      });
    }
  };

  const statCards = [
    { name: "Total Employees", value: stats.totalEmployees, icon: Users, color: "bg-blue-500" },
    { name: "Present Today", value: stats.presentToday, icon: CalendarCheck, color: "bg-green-500" },
    { name: "Late Today", value: stats.lateToday, icon: Clock, color: "bg-amber-500" },
    { name: "On Leave", value: stats.onLeave, icon: TrendingUp, color: "bg-indigo-500" },
  ];

  const attendanceData = [
    { day: 'Mon', present: 22, absent: 2 },
    { day: 'Tue', present: 21, absent: 3 },
    { day: 'Wed', present: 23, absent: 1 },
    { day: 'Thu', present: 20, absent: 4 },
    { day: 'Fri', present: 22, absent: 2 },
    { day: 'Sat', present: 24, absent: 0 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Welcome back! Here's a real-time snapshot of your team's activity.</p>
        </div>
        {loading && <Loader2 className="w-6 h-6 animate-spin text-primary" />}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="p-6 bg-card border border-border rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${stat.color} text-white transition-transform group-hover:scale-110`}>
                  <Icon size={24} />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                  <p className="text-3xl font-bold">{loading ? "..." : stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-6 bg-card border border-border rounded-xl shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">Weekly Attendance</h3>
          <div style={{ width: '100%', height: 300 }}>
            {loading ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary/20" />
              </div>
            ) : (
              <ResponsiveContainer>
                <BarChart data={stats.weeklyData.length > 0 ? stats.weeklyData : []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                  <Bar dataKey="present" fill="#3b82f6" name="Present" radius={[4, 4, 0, 0]} barSize={30} />
                  <Bar dataKey="absent" fill="#ef4444" name="Absent" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        
        <div className="p-6 bg-card border border-border rounded-xl shadow-sm flex flex-col">
          <h3 className="text-lg font-semibold mb-4 text-slate-900">Recent Activity</h3>
          <div className="space-y-4 flex-1">
            {recentActivity.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground text-sm">
                No activity today yet.
              </div>
            ) : (
              recentActivity.map((activity, i) => (
                <div key={activity._id || i} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm shrink-0">
                    {activity.employeeId?.name?.charAt(0) || "E"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {activity.employeeId?.name || "Employee"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.status === "Present" ? `Checked in at ${activity.checkIn}` : `Marked as ${activity.status}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <button 
            onClick={() => window.location.href = "/admin/attendance"}
            className="mt-4 text-sm font-medium text-primary hover:underline flex items-center gap-1"
          >
            View all activity <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
