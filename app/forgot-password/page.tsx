"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Shield, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ForgotPasswordContent() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role") || "employee";
  const isAdmin = roleParam === "admin";

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action: "verify_email" }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(2);
        toast.success("OTP has been sent to your email.");
      } else {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        toast.error(errorMsg || "Account not found.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, action: "verify_otp" }),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(3);
        toast.success("OTP verified. Please set your new password.");
      } else {
        const errorMsg = data.details ? `${data.error}: ${data.details}` : data.error;
        toast.error(errorMsg || "Invalid or expired OTP.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword, action: "reset" }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successfully!");
        setTimeout(() => {
          router.push(`/login?role=${roleParam}`);
        }, 2000);
      } else {
        toast.error(data.error || "Failed to reset password.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
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
          <Link href={`/login?role=${roleParam}`}>
            <ArrowLeft size={18} />
            Back to {isAdmin ? "Admin" : "Employee"} Login
          </Link>
        </Button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 text-white"
      >
        <div className="text-center space-y-2">
          <div className="w-20 h-20 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center mx-auto mb-4">
            <Shield className="text-blue-400" size={40} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{isAdmin ? "Admin Recovery" : "Account Recovery"}</h1>
          <p className="text-blue-200/70 text-sm">
            {step === 1 && `Verify your ${isAdmin ? "admin " : ""}identity`}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Set your new secure password"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyEmail}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="email" className="text-blue-100">{isAdmin ? "Admin Email Address" : "Email Address"}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-white/40" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder={isAdmin ? "admin@awence.com" : "employee@awence.com"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary text-white"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Send OTP"}
              </Button>
            </motion.form>
          ) : step === 2 ? (
            <motion.form
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOTP}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-blue-100">Verification Code (OTP)</Label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3 top-3 text-white/40" size={18} />
                  <Input
                    id="otp"
                    type="text"
                    placeholder="123456"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary text-white tracking-[0.5em] font-bold text-center"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Verify OTP"}
              </Button>
              <button 
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-xs text-blue-400 hover:underline"
              >
                Use a different email
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleResetPassword}
              className="space-y-6"
            >
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-blue-100">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-white/40" size={18} />
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary text-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-blue-100">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-white/40" size={18} />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/5 border-white/10 focus:border-primary text-white"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                className="w-full py-6 text-lg font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20"
                disabled={loading}
              >
                {loading ? <Loader2 className="animate-spin mr-2" /> : "Update Password"}
              </Button>
            </motion.form>
          )}
        </AnimatePresence>

        <div className="text-center pt-4">
          <p className="text-xs text-blue-200/50">
            For critical access issues, contact system support.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    }>
      <ForgotPasswordContent />
    </Suspense>
  );
}
