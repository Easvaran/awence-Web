"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { User, Mail, Lock, ShieldCheck, ArrowRight, Calendar, Phone, Hash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";

const signupSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  age: z.string().min(1, "Age is required"),
  dob: z.string().min(1, "Date of birth is required"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormValues = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      age: "",
      dob: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: SignupFormValues) => {
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          age: parseInt(data.age),
          dob: data.dob,
          email: data.email,
          mobile: data.mobile,
          password: data.password,
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Account created. Waiting for admin approval.");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        toast.error(result.error || "Failed to create account");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      toast.error("An error occurred during signup");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
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
            className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/50"
          >
            <User className="text-primary" size={40} />
          </motion.div>
          <h1 className="text-4xl font-extrabold tracking-tight">Employee Signup</h1>
          <p className="text-blue-200/70">Join the Awence Team</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-blue-100">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-white/40" size={18} />
                <Input
                  id="name"
                  placeholder="John Doe"
                  {...register("name")}
                  className={`pl-10 bg-white/5 border-white/10 focus:border-primary text-white placeholder:text-white/20 ${
                    errors.name ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-blue-100">Age</Label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 text-white/40" size={18} />
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  {...register("age")}
                  className={`pl-10 bg-white/5 border-white/10 focus:border-primary text-white placeholder:text-white/20 ${
                    errors.age ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.age && <p className="text-xs text-red-400">{errors.age.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-blue-100">Date of Birth</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-white/40" size={18} />
                <Input
                  id="dob"
                  type="date"
                  {...register("dob")}
                  className={`pl-10 bg-white/5 border-white/10 focus:border-primary text-white ${
                    errors.dob ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.dob && <p className="text-xs text-red-400">{errors.dob.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile" className="text-blue-100">Mobile Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 text-white/40" size={18} />
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="1234567890"
                  {...register("mobile")}
                  className={`pl-10 bg-white/5 border-white/10 focus:border-primary text-white placeholder:text-white/20 ${
                    errors.mobile ? "border-red-500 focus:border-red-500" : ""
                  }`}
                />
              </div>
              {errors.mobile && <p className="text-xs text-red-400">{errors.mobile.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-100">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-white/40" size={18} />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                {...register("email")}
                className={`pl-10 bg-white/5 border-white/10 focus:border-primary text-white placeholder:text-white/20 ${
                  errors.email ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
            </div>
            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-100">Password</Label>
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
            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-blue-100">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-white/40" size={18} />
              <Input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className={`pl-10 bg-white/5 border-white/10 focus:border-primary text-white ${
                  errors.confirmPassword ? "border-red-500 focus:border-red-500" : ""
                }`}
              />
            </div>
            {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button type="submit" className="w-full py-6 text-lg font-bold bg-primary hover:bg-primary/90 transition-all shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </Button>
          </motion.div>
        </form>

        <div className="text-center pt-4 space-y-2">
          <p className="text-sm text-blue-200/50">
            Already have an account? <Link href="/login?role=employee" className="text-primary hover:underline">Login here</Link>
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-blue-200/30">
            <ShieldCheck size={14} />
            <span>Admin approval required for access</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
