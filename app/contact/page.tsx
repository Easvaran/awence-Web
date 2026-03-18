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
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { useState } from "react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Visit Us",
    details: ["No 8, Bharathi Nagar, GH Road", "Thirumangalam, Madurai 625706"],
  },
  {
    icon: Phone,
    title: "Call Us",
    details: ["+91 77086 65431"],
  },
  {
    icon: Mail,
    title: "Email Us",
    details: ["support@awence.com"],
  },
  {
    icon: Clock,
    title: "Business Hours",
    details: ["Mon - Fri: 9:00 AM - 6:00 PM", "24/7 Support Available"],
  },
];

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
                  {contactInfo.map((info, index) => (
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
                </div>

                {/* Global Offices */}
                {/* <div className="mt-12 pt-12 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-6">
                    Global Offices
                  </h3>
                  <div className="space-y-4">
                    {[
                      { city: "New York", country: "United States" },
                      { city: "London", country: "United Kingdom" },
                      { city: "Singapore", country: "Singapore" },
                      { city: "Manila", country: "Philippines" },
                    ].map((office, index) => (
                      <div key={index}>
                        <p className="font-medium text-foreground">
                          {office.city}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {office.country}
                        </p>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Teaser */}
        <section className="py-12 lg:py-16 bg-muted/50">
          <div className="max-w-2xl mx-auto px-6 lg:px-8 text-center">
            <h2 className="text-2xl lg:text-3xl font-semibold text-foreground mb-3">
              Have questions?
            </h2>
            <p className="text-muted-foreground mb-6">
              Our team is ready to answer any questions you might have about our services, pricing, or implementation process.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button variant="outline" asChild>
                <a href="tel:+917708665431">Call Us Now</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@awence.com">Email Us</a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
