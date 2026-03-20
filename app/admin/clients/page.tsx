"use client";

import { useState, useEffect } from "react";
import { Search, Mail, Phone, Calendar, User, MessageSquare, Trash2, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

interface Contact {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
  status: "new" | "read" | "responded";
  createdAt: string;
}

export default function ClientsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (Array.isArray(data)) {
        setContacts(data);
      }
    } catch (error) {
      toast.error("Failed to load contact messages");
    } finally {
      setLoading(false);
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      // Note: We'll need to add a DELETE method to /api/contact/[id] or similar if it doesn't exist.
      // For now, let's assume it might not exist yet and we'll check later.
      const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted successfully");
        fetchContacts();
      } else {
        toast.error("Failed to delete message");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        toast.success("Status updated");
        fetchContacts();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const fullName = `${contact.firstName} ${contact.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      contact.email.toLowerCase().includes(search) ||
      contact.message.toLowerCase().includes(search)
    );
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Client Inquiries</h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">Manage and respond to messages from your website's contact form.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <MessageSquare size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Total Messages</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">{contacts.length}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Clock size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">New Messages</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {contacts.filter(c => c.status === 'new').length}
              </h3>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={20} className="sm:w-6 sm:h-6" />
            </div>
            <div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Responded</p>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {contacts.filter(c => c.status === 'responded').length}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <Input
            placeholder="Search by name, email or message..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-slate-700">Client</th>
                <th className="p-4 font-semibold text-slate-700">Contact Info</th>
                <th className="p-4 font-semibold text-slate-700">Message</th>
                <th className="p-4 font-semibold text-slate-700">Status</th>
                <th className="p-4 font-semibold text-slate-700">Date</th>
                <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <Clock className="animate-spin" size={20} />
                      Loading messages...
                    </div>
                  </td>
                </tr>
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No messages found.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredContacts.map((contact) => (
                    <motion.tr
                      key={contact._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-semibold uppercase">
                            {contact.firstName?.[0] || ""}{contact.lastName?.[0] || ""}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{contact.firstName || ""} {contact.lastName || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail size={14} />
                            {contact.email || "No email"}
                          </div>
                          {contact.phone && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Phone size={14} />
                              {contact.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-slate-600 line-clamp-2 max-w-xs" title={contact.message}>
                          {contact.message || "No message content"}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          contact.status === 'new' ? 'bg-blue-100 text-blue-700' :
                          contact.status === 'read' ? 'bg-slate-100 text-slate-700' :
                          'bg-emerald-100 text-emerald-700'
                        }`}>
                          {(contact.status || "new").charAt(0).toUpperCase() + (contact.status || "new").slice(1)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar size={14} />
                          {contact.createdAt ? format(new Date(contact.createdAt), "MMM d, yyyy") : "N/A"}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {contact.status !== 'responded' && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => updateStatus(contact._id, 'responded')}
                            >
                              <CheckCircle2 size={18} />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => deleteContact(contact._id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
