import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CTASection } from "@/components/home/cta-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Landmark,
  ShoppingCart,
  Stethoscope,
  Plane,
  Cpu,
  Building2,
  GraduationCap,
  Factory,
  ArrowRight,
  Check,
} from "lucide-react";

const industries = [
  {
    icon: Landmark,
    title: "Financial Services",
    description:
      "Secure and compliant solutions for banking, insurance, and fintech companies.",
    services: [
      "Loan Processing",
      "Claims Management",
      "KYC Verification",
      "Fraud Detection",
      "Customer Onboarding",
    ],
    stats: { clients: "80+", satisfaction: "99.2%" },
  },
  {
    icon: ShoppingCart,
    title: "Retail & E-Commerce",
    description:
      "End-to-end support for online and offline retail operations.",
    services: [
      "Order Management",
      "Inventory Support",
      "Customer Service",
      "Returns Processing",
      "Marketplace Integration",
    ],
    stats: { clients: "120+", satisfaction: "98.5%" },
  },
  {
    icon: Stethoscope,
    title: "Healthcare",
    description:
      "HIPAA-compliant services for healthcare providers and payers.",
    services: [
      "Medical Billing",
      "Claims Processing",
      "Patient Support",
      "Appointment Scheduling",
      "Medical Records Management",
    ],
    stats: { clients: "60+", satisfaction: "99.5%" },
  },
  {
    icon: Plane,
    title: "Travel & Hospitality",
    description:
      "Comprehensive support for airlines, hotels, and travel agencies.",
    services: [
      "Reservation Management",
      "Guest Services",
      "Loyalty Programs",
      "Cancellation Handling",
      "Multi-language Support",
    ],
    stats: { clients: "45+", satisfaction: "98.8%" },
  },
  {
    icon: Cpu,
    title: "Technology",
    description:
      "Technical support and back-office solutions for software and hardware companies.",
    services: [
      "Technical Support",
      "Software Testing",
      "Help Desk Services",
      "SaaS Support",
      "Product Documentation",
    ],
    stats: { clients: "90+", satisfaction: "99.0%" },
  },
  {
    icon: Building2,
    title: "Real Estate",
    description:
      "Administrative and customer support for property management and brokerages.",
    services: [
      "Lead Generation",
      "Property Management Support",
      "Tenant Services",
      "Document Processing",
      "Market Research",
    ],
    stats: { clients: "35+", satisfaction: "98.2%" },
  },
  {
    icon: GraduationCap,
    title: "Education",
    description:
      "Support services for educational institutions and EdTech companies.",
    services: [
      "Student Support",
      "Enrollment Processing",
      "LMS Administration",
      "Content Moderation",
      "Alumni Relations",
    ],
    stats: { clients: "50+", satisfaction: "99.1%" },
  },
  {
    icon: Factory,
    title: "Manufacturing",
    description:
      "Back-office and supply chain support for manufacturing enterprises.",
    services: [
      "Supply Chain Support",
      "Vendor Management",
      "Quality Documentation",
      "Order Processing",
      "Logistics Coordination",
    ],
    stats: { clients: "40+", satisfaction: "98.7%" },
  },
];

export default function IndustriesPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-foreground">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60 mb-6">
                Industries We Serve
              </p>
              <h1 className="text-4xl lg:text-5xl font-semibold text-primary-foreground leading-tight text-balance">
                Industry-specific expertise that drives results
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed">
                We understand that each industry has unique challenges and requirements. Our specialized teams bring deep domain knowledge to deliver tailored solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Industries Grid */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {industries.map((industry, index) => (
                <div
                  key={index}
                  className="p-8 border border-border rounded-lg hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-muted flex-shrink-0">
                      <industry.icon className="w-7 h-7 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-foreground">
                        {industry.title}
                      </h2>
                      <p className="mt-2 text-muted-foreground">
                        {industry.description}
                      </p>

                      {/* Services List */}
                      <div className="mt-6 grid grid-cols-2 gap-2">
                        {industry.services.map((service, serviceIndex) => (
                          <div
                            key={serviceIndex}
                            className="flex items-center gap-2"
                          >
                            <Check className="w-4 h-4 text-foreground flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">
                              {service}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Stats */}
                      <div className="mt-6 pt-6 border-t border-border flex gap-8">
                        <div>
                          <p className="text-2xl font-semibold text-foreground">
                            {industry.stats.clients}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Active Clients
                          </p>
                        </div>
                        <div>
                          <p className="text-2xl font-semibold text-foreground">
                            {industry.stats.satisfaction}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Satisfaction Rate
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Industry Expertise Matters */}
        <section className="py-12 lg:py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
                  Why It Matters
                </p>
                <h2 className="text-3xl lg:text-4xl font-semibold text-foreground leading-tight text-balance">
                  Industry expertise accelerates your success
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  Our specialized teams don't just process tasks—they understand your industry's language, regulations, and best practices from day one.
                </p>
                <ul className="mt-8 space-y-4">
                  {[
                    "Faster onboarding with pre-trained industry experts",
                    "Compliance-ready solutions for regulated industries",
                    "Industry-specific KPIs and performance metrics",
                    "Benchmarking against industry standards",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-foreground flex-shrink-0" />
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="mt-8 group">
                  <Link href="/contact">
                    Discuss Your Industry Needs
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "8+", label: "Industries Served" },
                  { value: "500+", label: "Total Clients" },
                  { value: "98.6%", label: "Avg Satisfaction" },
                  { value: "15+", label: "Years Experience" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="p-6 bg-background border border-border rounded-lg text-center"
                  >
                    <p className="text-3xl font-semibold text-foreground">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
