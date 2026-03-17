"use client";

import { signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { User, Lock, AlertCircle, CheckCircle2, ShieldCheck, Shield, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Suspense, useState } from "react";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "employee";
  const isAdminPortal = roleParam === "admin";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    console.log("Login form submitted:", data.email);
    setLoading(true);

    try {
      console.log("Attempting signIn...");
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      console.log("SignIn result:", result);

      if (result?.error) {
        console.log("Login failed error code:", result.error);
        if (result.error.includes("pending_approval")) {
          toast.error("Your account is pending admin approval.");
        } else if (result.error.includes("account_rejected")) {
          toast.error("Your account has been rejected by the administrator.");
        } else {
          toast.error("Invalid email or password");
        }
      } else {
        console.log("Login successful, determining role...");
        // Fetch the updated session to get the role
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = (sessionData?.user as any)?.role;
        
        console.log("Session role:", role);
        
        // Portal Validation Logic
        if (!isAdminPortal && role === "admin") {
          // Admin trying to login via Employee portal
          toast.error("Please use the Admin login portal.");
          await signOut({ redirect: false });
          setLoading(false);
          return;
        }

        if (isAdminPortal && role !== "admin") {
          // Employee trying to login via Admin portal
          toast.error("This portal is for administrators only.");
          await signOut({ redirect: false });
          setLoading(false);
          return;
        }
        
        toast.success("Logged in successfully");
        
        setTimeout(() => {
          if (role === "admin") {
            router.push("/admin");
          } else {
            router.push("/employee/dashboard");
          }
        }, 500);
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("An error occurred. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="w-full max-w-md mb-4"
      >
        <Button asChild variant="ghost" className="text-white hover:bg-white/10 gap-2">
          <Link href="/">
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-white"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border ${
              isAdminPortal ? "bg-blue-500/20 border-blue-500/50" : "bg-primary/20 border-primary/50"
            }`}
          >
            {isAdminPortal ? <Shield className="text-blue-400" size={40} /> : <Lock className="text-primary" size={40} />}
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            {isAdminPortal ? "Admin Login" : "Employee Login"}
          </h1>
          <p className="text-blue-200/70">
            {isAdminPortal ? "Authorized Access Only" : "Welcome Back"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-100">Email Address</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 text-white/40" size={18} />
              <Input
                id="email"
                type="email"
                placeholder={isAdminPortal ? "admin@awence.com" : "employee@awence.com"}
                {...register("email")}
                className={`pl-10 bg-white/5 border-white/10 focus:border-primary text-white placeholder:text-white/20 ${
                  errors.email ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
            </div>
            {errors.email && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-red-400 font-medium"
              >
                {errors.email.message}
              </motion.p>
            )}
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password" className="text-blue-100">Password</Label>
              <Link 
                href={`/forgot-password?role=${roleParam}`}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-white/40" size={18} />
              <Input
                id="password"
                type="password"
                {...register("password")}
                className={`pl-10 bg-white/5 border-white/10 focus:border-primary text-white ${
                  errors.password ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
            </div>
            {errors.password && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-red-400 font-medium"
              >
                {errors.password.message}
              </motion.p>
            )}
          </div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button 
              type="submit" 
              className={`w-full py-6 text-lg font-bold transition-all shadow-lg ${
                isAdminPortal 
                  ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/20" 
                  : "bg-primary hover:bg-primary/90 shadow-primary/20"
              }`} 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <AlertCircle size={20} />
                  </motion.div>
                  Authenticating...
                </div>
              ) : isAdminPortal ? "Unlock Dashboard" : "Login"}
            </Button>
          </motion.div>
        </form>

        <div className="text-center pt-4 space-y-4">
          <p className="text-sm text-blue-200/50">
            {isAdminPortal ? "Restricted Area" : "Secure Portal Access"}
          </p>
          {!isAdminPortal && (
            <div className="pt-4 border-t border-white/10">
              <Button asChild variant="outline" className="w-full py-4 border-white/20 bg-white/10 text-white hover:bg-white/20 transition-colors">
                <Link href="/signup">Create Employee Account</Link>
              </Button>
              <p className="text-xs text-blue-200/50 mt-2">
                Registration requires admin approval
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
