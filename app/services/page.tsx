import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CTASection } from "@/components/home/cta-section";
import {
  Headphones,
  FileText,
  BarChart3,
  Zap,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Database,
  FileCheck,
  Calculator,
  Users,
  TrendingUp,
  PieChart,
  Brain,
  Cog,
  Bot,
  Cloud,
  Shield,
  Workflow,
  Check,
} from "lucide-react";

const services = [
  {
    id: "customer-support",
    icon: Headphones,
    title: "Customer Support",
    description:
      "Deliver exceptional customer experiences with our comprehensive multi-channel support solutions.",
    features: [
      {
        icon: MessageSquare,
        title: "Live Chat Support",
        description: "Real-time assistance for your customers across web and mobile platforms.",
      },
      {
        icon: Mail,
        title: "Email Management",
        description: "Efficient email handling with guaranteed response times and quality.",
      },
      {
        icon: Phone,
        title: "Voice Support",
        description: "Professional inbound and outbound call center services.",
      },
      {
        icon: Clock,
        title: "24/7 Availability",
        description: "Round-the-clock support in multiple languages and time zones.",
      },
    ],
  },
  {
    id: "back-office",
    icon: FileText,
    title: "Back Office Processing",
    description:
      "Streamline your administrative operations and focus on strategic business growth.",
    features: [
      {
        icon: Database,
        title: "Data Entry & Management",
        description: "Accurate and efficient data entry with quality assurance protocols.",
      },
      {
        icon: FileCheck,
        title: "Document Processing",
        description: "End-to-end document management, verification, and archival.",
      },
      {
        icon: Calculator,
        title: "Accounting Support",
        description: "Bookkeeping, invoicing, and financial data processing services.",
      },
      {
        icon: Users,
        title: "HR Administration",
        description: "Payroll processing, benefits administration, and employee records management.",
      },
    ],
  },
  {
    id: "data-processing",
    icon: BarChart3,
    title: "Data Processing & Analytics",
    description:
      "Transform raw data into actionable insights that drive informed business decisions.",
    features: [
      {
        icon: TrendingUp,
        title: "Data Analytics",
        description: "Advanced analytics to uncover trends and opportunities in your data.",
      },
      {
        icon: PieChart,
        title: "Business Intelligence",
        description: "Comprehensive BI solutions with custom dashboards and reporting.",
      },
      {
        icon: Brain,
        title: "Predictive Modeling",
        description: "AI-powered predictions to anticipate market trends and customer behavior.",
      },
      {
        icon: Database,
        title: "Data Warehousing",
        description: "Secure and scalable data storage and management solutions.",
      },
    ],
  },
  {
    id: "digital-transformation",
    icon: Zap,
    title: "Digital Transformation",
    description:
      "Modernize your operations with cutting-edge technology and automation solutions.",
    features: [
      {
        icon: Bot,
        title: "Process Automation",
        description: "RPA solutions to automate repetitive tasks and improve efficiency.",
      },
      {
        icon: Cloud,
        title: "Cloud Migration",
        description: "Seamless transition to cloud-based systems and infrastructure.",
      },
      {
        icon: Shield,
        title: "Cybersecurity",
        description: "Comprehensive security solutions to protect your digital assets.",
      },
      {
        icon: Workflow,
        title: "Workflow Optimization",
        description: "Streamlined processes that reduce bottlenecks and improve productivity.",
      },
    ],
  },
];

const processSteps = [
  {
    step: "01",
    title: "Discovery",
    description: "We analyze your current operations, challenges, and goals to understand your unique needs.",
  },
  {
    step: "02",
    title: "Strategy",
    description: "Our experts design a customized solution that aligns with your business objectives.",
  },
  {
    step: "03",
    title: "Implementation",
    description: "We deploy your solution with careful planning to minimize disruption to your operations.",
  },
  {
    step: "04",
    title: "Optimization",
    description: "Continuous monitoring and improvement to ensure sustained excellence and ROI.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-foreground">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60 mb-6">
                Our Services
              </p>
              <h1 className="text-4xl lg:text-5xl font-semibold text-primary-foreground leading-tight text-balance">
                Comprehensive TECH solutions for your business needs
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed">
                From customer support to digital transformation, we provide end-to-end services that help you operate more efficiently and scale with confidence.
              </p>
            </div>
          </div>
        </section>

        {/* Services Sections */}
        {services.map((service, index) => (
          <section
            key={service.id}
            id={service.id}
            className={`py-12 lg:py-16 ${index % 2 === 0 ? "bg-background" : "bg-muted/50"}`}
          >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
              <div className="grid lg:grid-cols-2 gap-16 items-start">
                {/* Service Header */}
                <div className="lg:sticky lg:top-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-foreground">
                      <service.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h2 className="text-3xl font-semibold text-foreground">
                      {service.title}
                    </h2>
                  </div>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-8 space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-foreground flex-shrink-0" />
                        <span className="text-foreground">{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Features Grid */}
                <div className="grid sm:grid-cols-2 gap-6">
                  {service.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className="p-6 bg-background border border-border rounded-lg"
                    >
                      <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted mb-4">
                        <feature.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* Process Section */}
        <section className="py-12 lg:py-16 bg-foreground">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60 mb-4">
                Our Process
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold text-primary-foreground">
                How we work with you
              </h2>
              <p className="mt-4 text-primary-foreground/70">
                A proven methodology that ensures successful outcomes for every engagement.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-primary-foreground/20 mb-6">
                    <span className="text-2xl font-semibold text-primary-foreground">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
