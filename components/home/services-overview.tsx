import Link from "next/link";
import { Layout, Server, Database, Cloud } from "lucide-react";

const services = [
  {
    icon: Layout,
    title: "App Development",
    description: "Build robust, scalable, and beautiful web and mobile applications using modern frameworks.",
    href: "/services",
  },
  {
    icon: Server,
    title: "Backend Solutions",
    description: "Powerful server-side architectures designed for performance and security.",
    href: "/services",
  },
  {
    icon: Database,
    title: "Database Management",
    description: "Secure and optimized data storage solutions tailored to your business needs.",
    href: "/services",
  },
  {
    icon: Cloud,
    title: "DevOps & Cloud",
    description: "Seamless deployment and infrastructure management for maximum uptime.",
    href: "/services",
  },
];

export function ServicesOverview() {
  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
            What We Do
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
            Our collection of services spans every stage of the transformation process.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Explore how we help businesses transform.
          </p>
        </div>

        {/* Services Grid */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <Link
              key={index}
              href={service.href}
              className="group p-8 border border-border rounded-lg hover:border-foreground/20 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-muted">
                  <service.icon className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:underline underline-offset-4">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <p className="mt-4 text-sm font-medium text-foreground">
                    Learn more →
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
