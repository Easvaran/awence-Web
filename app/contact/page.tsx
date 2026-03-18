"use client";


import React from "react"

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, ArrowRight, ExternalLink, Facebook, Instagram, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";

const services = [
  "Customer Support",
  "Back Office Processing",
  "Data Processing & Analytics",
  "Digital Transformation",
  "Other",
];

const companySizes = [
  "1-50 employees",
  "51-200 employees",
  "201-500 employees",
  "501-1000 employees",
  "1000+ employees",
];

import { toast } from "sonner";

export default function ContactPage() {
  const [settings, setSettings] = useState<any>(null);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    companySize: "",
    service: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/contact-settings");
      const data = await res.json();
      if (res.ok) {
        setSettings(data);
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const dynamicContactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: settings?.address ? [settings.address] : ["No 8, Bharathi Nagar, GH Road", "Thirumangalam, Madurai 625706"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: settings?.phone ? [settings.phone] : ["+91 77086 65431"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: settings?.email ? [settings.email] : ["support@awence.com"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "24/7 Support Available"],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      if (res.ok) {
        setIsSubmitted(true);
        toast.success("Message sent successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-foreground">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60 mb-6">
                Contact Us
              </p>
              <h1 className="text-4xl lg:text-5xl font-semibold text-primary-foreground leading-tight text-balance">
                Let's discuss your business needs
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed">
                Ready to transform your operations? Get in touch with our team to explore how Awence can help you achieve your goals.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-16">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Send us a message
                </h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and our team will get back to you within 24 hours.
                </p>

                {isSubmitted ? (
                  <div className="p-8 bg-muted/50 rounded-lg text-center">
                    <div className="w-16 h-16 rounded-full bg-foreground flex items-center justify-center mx-auto mb-6">
                      <ArrowRight className="w-8 h-8 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Thank you for reaching out!
                    </h3>
                    <p className="text-muted-foreground">
                      We've received your message and will get back to you within 24 hours.
                    </p>
                    <Button
                      className="mt-6"
                      onClick={() => {
                        setIsSubmitted(false);
                        setFormState({
                          firstName: "",
                          lastName: "",
                          email: "",
                          phone: "",
                          company: "",
                          companySize: "",
                          service: "",
                          message: "",
                        });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          value={formState.firstName}
                          onChange={(e) =>
                            setFormState({ ...formState, firstName: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          value={formState.lastName}
                          onChange={(e) =>
                            setFormState({ ...formState, lastName: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@company.com"
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({ ...formState, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formState.phone}
                          onChange={(e) =>
                            setFormState({ ...formState, phone: e.target.value })
                          }
                        />
                      </div>
                    </div>
{/* 
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          placeholder="Company Name"
                          value={formState.company}
                          onChange={(e) =>
                            setFormState({ ...formState, company: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="companySize">Company Size</Label>
                        <Select
                          value={formState.companySize}
                          onValueChange={(value) =>
                            setFormState({ ...formState, companySize: value })
                          }
                        >
                          <SelectTrigger id="companySize">
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            {companySizes.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div> */}

                    {/* <div className="space-y-2">
                      <Label htmlFor="service">Service Interest</Label>
                      <Select
                        value={formState.service}
                        onValueChange={(value) =>
                          setFormState({ ...formState, service: value })
                        }
                      >
                        <SelectTrigger id="service">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          {services.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div> */}

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your project and how we can help..."
                        rows={5}
                        value={formState.message}
                        onChange={(e) =>
                          setFormState({ ...formState, message: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Button type="submit" size="lg" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-8">
                  Get in touch
                </h2>
                <div className="space-y-8">
                  {dynamicContactInfo.map((info, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted flex-shrink-0">
                        <info.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {info.title}
                        </h3>
                        {info.details.map((detail, detailIndex) => {
                          if (info.title === "Call Us") {
                            return (
                              <a
                                key={detailIndex}
                                href={`tel:${detail.replace(/\s+/g, '')}`}
                                className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors block"
                              >
                                {detail}
                              </a>
                            );
                          }
                          if (info.title === "Email Us") {
                            return (
                              <a
                                key={detailIndex}
                                href={`mailto:${detail}`}
                                className="text-sm text-muted-foreground mt-1 hover:text-foreground transition-colors block"
                              >
                                {detail}
                              </a>
                            );
                          }
                          return (
                            <p
                              key={detailIndex}
                              className="text-sm text-muted-foreground mt-1"
                            >
                              {detail}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  {/* Social Media Links Section */}
                  {(settings?.facebook || settings?.instagram || settings?.linkedin) && (
                    <div className="pt-8 border-t border-border mt-8">
                      <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                      <div className="flex gap-4">
                        {settings?.facebook && (
                          <a 
                            href={settings.facebook} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                            aria-label="Facebook"
                          >
                            <Facebook size={20} />
                          </a>
                        )}
                        {settings?.instagram && (
                          <a 
                            href={settings.instagram} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                            aria-label="Instagram"
                          >
                            <Instagram size={20} />
                          </a>
                        )}
                        {settings?.linkedin && (
                          <a 
                            href={settings.linkedin} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-all shadow-sm"
                            aria-label="LinkedIn"
                          >
                            <Linkedin size={20} />
                          </a>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Live Map Section */}
                  <div className="mt-12 space-y-4">
                    <div className="relative rounded-2xl overflow-hidden border border-border shadow-sm bg-muted aspect-video">
                      {settings?.mapUrl ? (
                        <iframe
                          src={settings.mapUrl}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          title="Office Location"
                        ></iframe>
                      ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                          Map location not configured
                        </div>
                      )}
                      
                      {settings?.mapUrl && (
                        <div className="absolute top-4 left-4">
                          <Button size="sm" variant="secondary" className="gap-2 shadow-md bg-white/90 backdrop-blur-sm hover:bg-white" asChild>
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(settings.address || "Awence Thirumangalam")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink size={14} />
                              Open in Maps
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
