"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Clock, MapPin, CheckCircle, XCircle, LogOut, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

// Office Location (No 8, Bharathi Nagar, GH Road, Thirumangalam, Madurai)
const OFFICE_LAT = 9.8230;
const OFFICE_LNG = 77.9860;
const MAX_DISTANCE_METERS = 1000; // Updated to 1km radius as per user request

export default function EmployeeDashboard() {
  const { data: session, status } = useSession();
  const [time, setTime] = useState(new Date());
  const [todayRecord, setTodayRecord] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [absentReason, setAbsentReason] = useState("");
  const [isMarkingAbsent, setIsMarkingAbsent] = useState(false);
  const [isCheckingLocation, setIsCheckingLocation] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceFromOffice, setDistanceFromOffice] = useState<number | null>(null);

  useEffect(() => {
    console.log("Dashboard - Session status:", status);
    const timer = setInterval(() => setTime(new Date()), 1000);
    if (status === "authenticated") {
      fetchTodayRecord();
      getCurrentLocation();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
    return () => clearInterval(timer);
  }, [status]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        const dist = calculateDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
        setDistanceFromOffice(dist);
      },
      (error) => {
        console.error("Location error:", error);
        let errorMessage = "Unable to retrieve your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable it in your browser and phone settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Your location is currently unavailable. Please try again later.";
            break;
          case error.TIMEOUT:
            errorMessage = "Getting your location timed out. Please ensure you have a stable connection.";
            break;
        }
        toast.error(errorMessage);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  // Haversine formula to calculate distance in meters
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const fetchTodayRecord = async () => {
    try {
      console.log("Dashboard - Fetching today's record for:", session?.user?.email);
      const res = await fetch("/api/attendance");
      const data = await res.json();
      
      if (Array.isArray(data)) {
        const today = new Date().toISOString().split('T')[0];
        const userId = (session?.user as any)?.id;
        const record = data.find((r: any) => {
          const recordDate = new Date(r.date).toISOString().split('T')[0];
          return recordDate === today && r.employeeId?._id === userId;
        });
        setTodayRecord(record);
      }
    } catch (error) {
      console.error("Dashboard - Error fetching attendance:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setIsCheckingLocation(true);

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsCheckingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const dist = calculateDistance(latitude, longitude, OFFICE_LAT, OFFICE_LNG);
        
        console.log("Check-in distance:", dist);

        if (dist > MAX_DISTANCE_METERS) {
          toast.error(`You are too far from the office to check in (${Math.round(dist)}m). Maximum distance is ${MAX_DISTANCE_METERS}m.`);
          setIsCheckingLocation(false);
          return;
        }

        try {
          const now = new Date();
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();
          
          // If check-in is at or after 10:00 AM, mark as "Late"
          const attendanceStatus = (currentHour > 10 || (currentHour === 10 && currentMinute >= 0)) 
            ? "Late" 
            : "Present";

          const res = await fetch("/api/attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              employeeId: (session?.user as any)?.id,
              date: now,
              status: attendanceStatus,
              checkIn: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              location: { lat: latitude, lng: longitude }
            }),
          });

          if (res.ok) {
            toast.success(attendanceStatus === "Late" ? "Checked in (Late)" : "Checked in successfully!");
            fetchTodayRecord();
          } else {
            toast.error("Failed to check in");
          }
        } catch (error) {
          toast.error("An error occurred");
        } finally {
          setIsCheckingLocation(false);
        }
      },
      (error) => {
        console.error("Location error during check-in:", error);
        let errorMessage = "Unable to verify your location.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied. Please enable it in your browser and phone settings to check in.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Your location is currently unavailable. Please try again to check in.";
            break;
          case error.TIMEOUT:
            errorMessage = "Getting your location timed out. Please ensure you have a stable connection and try again.";
            break;
        }
        toast.error(errorMessage);
        setIsCheckingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  };

  const handleCheckOut = async () => {
    if (!todayRecord) return;
    try {
      const res = await fetch(`/api/attendance/${todayRecord._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          checkOut: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }),
      });

      if (res.ok) {
        toast.success("Checked out successfully!");
        fetchTodayRecord();
      } else {
        toast.error("Failed to check out");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleMarkAbsent = async () => {
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: (session?.user as any)?.id,
          date: new Date(),
          status: "Absent",
          notes: absentReason,
        }),
      });

      if (res.ok) {
        toast.success("Marked as absent");
        setIsMarkingAbsent(false);
        fetchTodayRecord();
      } else {
        toast.error("Failed to mark absent");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  if (status === "loading" || (loading && status === "authenticated")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
        <p className="text-slate-500 font-medium text-lg animate-pulse">Initializing Portal...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4 p-4 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={40} className="text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Access Denied</h2>
        <p className="text-slate-500 max-w-xs">You must be logged in as an approved employee to access this portal.</p>
        <Button onClick={() => window.location.href = "/login?role=employee"} className="mt-4 px-8">
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Employee Portal</h1>
            <div className="flex items-center gap-2">
              <p className="text-slate-500">Welcome back, {session?.user?.name}</p>
              {(session?.user as any)?.employeeId && (
                <span className="text-[10px] font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full border border-primary/20">
                  {(session?.user as any).employeeId}
                </span>
              )}
            </div>
          </div>
          <Button variant="ghost" className="text-red-600 gap-2" onClick={() => signOut()}>
            <LogOut size={18} /> Logout
          </Button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center space-y-6"
          >
            <div className="text-center space-y-2">
              <p className="text-slate-500 font-medium uppercase tracking-wider text-sm">Current Time</p>
              <h2 className="text-6xl font-black text-slate-900 tabular-nums">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </h2>
              <p className="text-slate-400">
                {time.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
              {!todayRecord ? (
                <>
                  <Button 
                    className="flex-1 h-16 rounded-2xl text-lg font-bold gap-3" 
                    onClick={handleCheckIn}
                    disabled={isMarkingAbsent || isCheckingLocation}
                  >
                    {isCheckingLocation ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                        <Clock size={24} />
                      </motion.div>
                    ) : <CheckCircle size={24} />}
                    {isCheckingLocation ? "Verifying..." : "Check In"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 h-16 rounded-2xl text-lg font-bold gap-3 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setIsMarkingAbsent(true)}
                  >
                    <XCircle size={24} /> Mark Absent
                  </Button>
                </>
              ) : todayRecord.status === "Absent" ? (
                <div className="w-full p-4 bg-red-50 border border-red-100 rounded-2xl text-center text-red-700 font-bold">
                  You are marked as ABSENT today
                </div>
              ) : (
                <Button 
                  className="w-full h-16 rounded-2xl text-lg font-bold gap-3 bg-amber-600 hover:bg-amber-700" 
                  onClick={handleCheckOut}
                  disabled={!!todayRecord.checkOut}
                >
                  <LogOut size={24} /> {todayRecord.checkOut ? `Checked Out at ${todayRecord.checkOut}` : 'Check Out'}
                </Button>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Clock size={18} className="text-primary" /> Today's Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Office Timing</span>
                  <span className="font-bold text-blue-600">9:30 AM - 6:30 PM</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Check In</span>
                  <span className="font-bold text-slate-900">{todayRecord?.checkIn || "--:--"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-50">
                  <span className="text-slate-500 text-sm">Check Out</span>
                  <span className="font-bold text-slate-900">{todayRecord?.checkOut || "--:--"}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-slate-500 text-sm">Status</span>
                  <span className={`font-bold px-2 py-1 rounded-full text-xs ${
                    todayRecord?.status === 'Present' ? 'bg-green-100 text-green-700' :
                    todayRecord?.status === 'Late' ? 'bg-amber-100 text-amber-700' :
                    todayRecord?.status === 'Absent' ? 'bg-red-100 text-red-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {todayRecord?.status || "Not Marked"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 p-6 rounded-3xl shadow-lg text-white">
              <h3 className="text-lg font-bold mb-2">Location Status</h3>
              <p className="text-blue-100 text-sm mb-4 flex items-center gap-2">
                <MapPin size={14} /> Head Office, Awence
              </p>
              <div className="bg-white/10 p-4 rounded-2xl space-y-2">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full animate-pulse ${
                    distanceFromOffice !== null && distanceFromOffice <= MAX_DISTANCE_METERS 
                      ? "bg-green-400" 
                      : "bg-amber-400"
                  }`} />
                  <span className="text-xs font-medium">
                    {distanceFromOffice !== null 
                      ? `${Math.round(distanceFromOffice)}m from office` 
                      : "Verifying location..."}
                  </span>
                </div>
                {distanceFromOffice !== null && distanceFromOffice > MAX_DISTANCE_METERS && (
                  <p className="text-[10px] text-blue-200">
                    You must be within {MAX_DISTANCE_METERS}m to check in.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {isMarkingAbsent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white w-full max-w-md p-6 rounded-3xl shadow-2xl"
            >
              <h2 className="text-2xl font-bold mb-4">Reason for Absence</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Please provide a reason (optional)</Label>
                  <Input 
                    placeholder="Feeling unwell / Personal emergency..." 
                    value={absentReason}
                    onChange={(e) => setAbsentReason(e.target.value)}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={() => setIsMarkingAbsent(false)}>Cancel</Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700" onClick={handleMarkAbsent}>Submit Absence</Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
