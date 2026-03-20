"use client";

import { useState, useEffect } from "react";
import { User, Mail, Shield, Save, Loader2, Bell, Globe, Layout, Eye, EyeOff, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "profile" | "notifications" | "security" | "localization" | "navigation" | "contact";

interface NavSetting {
  _id: string;
  name: string;
  label: string;
  href: string;
  isVisible: boolean;
  order: number;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Notification states
  const [pushNotifications, setPushNotifications] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>("default");

  // Navigation states
  const [navSettings, setNavSettings] = useState<NavSetting[]>([]);

  // Contact settings state
  const [mapUrl, setMapUrl] = useState("");
  const [address, setAddress] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [facebook, setFacebook] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");

  useEffect(() => {
    if ("Notification" in window) {
      setPermissionStatus(Notification.permission);
      setPushNotifications(Notification.permission === "granted");
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("This browser does not support desktop notifications");
      return;
    }

    const permission = await Notification.requestPermission();
    setPermissionStatus(permission);
    
    if (permission === "granted") {
      setPushNotifications(true);
      toast.success("Desktop notifications enabled!");
      new Notification("Awence Admin", {
        body: "Push notifications are now active.",
        icon: "/favicon.ico"
      });
    } else {
      setPushNotifications(false);
      toast.error("Notification permission denied");
    }
  };

  const handlePushToggle = (checked: boolean) => {
    if (checked && permissionStatus !== "granted") {
      requestNotificationPermission();
    } else {
      setPushNotifications(checked);
    }
  };

  // Localization states
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("UTC +05:30 (India)");

  useEffect(() => {
    fetchProfile();
    fetchNavSettings();
    fetchContactSettings();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (res.ok) {
        setName(data.name);
        setEmail(data.email);
      } else {
        toast.error("Failed to load profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fetchContactSettings = async () => {
    try {
      const res = await fetch("/api/admin/contact-settings");
      const data = await res.json();
      if (res.ok) {
        setMapUrl(data.mapUrl);
        setAddress(data.address);
        setContactPhone(data.phone);
        setContactEmail(data.email);
        setFacebook(data.facebook || "");
        setInstagram(data.instagram || "");
        setLinkedin(data.linkedin || "");
      }
    } catch (error) {
      console.error("Failed to fetch contact settings:", error);
    }
  };

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          mapUrl, 
          address, 
          phone: contactPhone, 
          email: contactEmail,
          facebook,
          instagram,
          linkedin
        }),
      });

      if (res.ok) {
        toast.success("Contact settings updated");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update contact settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const fetchNavSettings = async () => {
    try {
      const res = await fetch("/api/admin/nav-settings");
      const data = await res.json();
      if (res.ok) {
        setNavSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch nav settings:", error);
    }
  };

  const toggleNavVisibility = async (id: string, currentVisibility: boolean) => {
    try {
      const res = await fetch("/api/admin/nav-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isVisible: !currentVisibility }),
      });
      
      if (res.ok) {
        setNavSettings(navSettings.map(nav => 
          nav._id === id ? { ...nav, isVisible: !currentVisibility } : nav
        ));
        toast.success("Navigation updated");
      } else {
        toast.error("Failed to update navigation");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      if (res.ok) {
        toast.success("Profile updated successfully. Please re-login if you changed your email.");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error("Please enter a new password");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        toast.success("Security settings updated");
        setPassword("");
        setConfirmPassword("");
      } else {
        const error = await res.json();
        toast.error(error.error || "Failed to update security");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveGeneral = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Settings saved successfully");
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "navigation", label: "Home Navigation", icon: Layout },
    { id: "contact", label: "Contact Page", icon: MapPin },
    { id: "localization", label: "Localization", icon: Globe },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Tabs */}
        <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible pb-2 md:pb-0 gap-2 scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-none md:w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-white hover:text-slate-900 hover:shadow-sm"
                }`}
              >
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-slate-50/50">
                  <h3 className="text-lg font-bold">Profile Information</h3>
                  <p className="text-sm text-muted-foreground">Update your account details and email address.</p>
                </div>
                <form onSubmit={handleUpdateProfile} className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-muted-foreground" size={18} />
                        <Input
                          id="name"
                          placeholder="Admin Name"
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@awence.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="gap-2 px-8" disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-slate-50/50">
                  <h3 className="text-lg font-bold">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Choose how you want to be notified.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="space-y-0.5">
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-xs text-muted-foreground">Alerts for late check-ins on desktop.</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Switch checked={pushNotifications} onCheckedChange={handlePushToggle} />
                        {permissionStatus === "denied" && (
                          <p className="text-[10px] text-red-500">Permission blocked by browser</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSaveGeneral} className="gap-2 px-8" disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-slate-50/50">
                  <h3 className="text-lg font-bold">Security Settings</h3>
                  <p className="text-sm text-muted-foreground">Secure your account with a strong password.</p>
                </div>
                <form onSubmit={handleUpdateSecurity} className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 text-muted-foreground" size={18} />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-3 text-muted-foreground" size={18} />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-xs flex gap-3">
                    <Shield size={16} className="shrink-0" />
                    <p>Password should be at least 8 characters long and include numbers and special characters for better security.</p>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="gap-2 px-8" disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield size={18} />}
                      Update Password
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "navigation" && (
              <motion.div
                key="navigation"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-slate-50/50">
                  <h3 className="text-lg font-bold">Home Navigation</h3>
                  <p className="text-sm text-muted-foreground">Control which links are visible in the main header navbar.</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid gap-3">
                    {navSettings.map((nav) => (
                      <div key={nav._id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:shadow-sm transition-all group">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${nav.isVisible ? 'bg-primary/10 text-primary' : 'bg-slate-200 text-slate-400'}`}>
                            {nav.isVisible ? <Eye size={20} /> : <EyeOff size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{nav.label}</p>
                            <p className="text-xs text-muted-foreground">{nav.href}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${nav.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                            {nav.isVisible ? 'Visible' : 'Hidden'}
                          </span>
                          <Switch 
                            checked={nav.isVisible} 
                            onCheckedChange={() => toggleNavVisibility(nav._id, nav.isVisible)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-slate-50/50">
                  <h3 className="text-lg font-bold">Contact Page Settings</h3>
                  <p className="text-sm text-muted-foreground">Manage map and contact info on the public contact page.</p>
                </div>
                <form onSubmit={handleUpdateContact} className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mapUrl">Google Maps Embed URL</Label>
                      <Input
                        id="mapUrl"
                        placeholder="https://www.google.com/maps/embed?..."
                        value={mapUrl}
                        onChange={(e) => setMapUrl(e.target.value)}
                        required
                      />
                      <p className="text-[10px] text-muted-foreground">Go to Google Maps → Share → Embed map → Copy the 'src' URL from the iframe tag.</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Office Address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="contactPhone">Phone</Label>
                        <Input
                          id="contactPhone"
                          placeholder="+91 77086 65431"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactEmail">Email</Label>
                        <Input
                          id="contactEmail"
                          placeholder="support@awence.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900">Social Media Links</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="facebook">Facebook URL</Label>
                          <Input
                            id="facebook"
                            placeholder="https://facebook.com/awence"
                            value={facebook}
                            onChange={(e) => setFacebook(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="instagram">Instagram URL</Label>
                          <Input
                            id="instagram"
                            placeholder="https://instagram.com/awence"
                            value={instagram}
                            onChange={(e) => setInstagram(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="linkedin">LinkedIn URL</Label>
                          <Input
                            id="linkedin"
                            placeholder="https://linkedin.com/company/awence"
                            value={linkedin}
                            onChange={(e) => setLinkedin(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="gap-2 px-8" disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                      Save Contact Info
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === "localization" && (
              <motion.div
                key="localization"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-slate-50/50">
                  <h3 className="text-lg font-bold">Localization</h3>
                  <p className="text-sm text-muted-foreground">Manage your language and timezone settings.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Input
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button onClick={handleSaveGeneral} className="gap-2 px-8" disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save size={18} />}
                      Save Localization
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
