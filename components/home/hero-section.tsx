import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative h-[70vh] min-h-[90vh] flex items-center bg-foreground overflow-hidden">
      {/* Animated Particles Background */}
      <Particles
        className="absolute inset-0 z-10"
        quantity={80}
        color="255, 255, 255"
        minSize={1}
        maxSize={1}
        speed={0.1}
      />

      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 py-12 lg:py-16 pointer-events-none">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60 mb-6">
              Modern Tech Solutions
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary-foreground leading-[1.1] tracking-tight text-balance">
              Streamline Your Business Operations
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed max-w-xl">
              Partner with Awence to transform your business processes. We deliver efficiency, scalability, and excellence in every service we provide.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 pointer-events-auto">
              <Button size="lg" variant="secondary" asChild className="group">
                <Link href="/contact">
                  Get in Touch
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
                <Link href="/services">Our Services</Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            {/* Glow */}
            <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-full" />

            {/* Image */}
            {/* className="relative" */}
            <div className="relative animate-float">
              <Image
                src="/images/hero-illustration-black.png"
                alt="Business process outsourcing illustration"
                width={600}
                height={600}
                priority
                // className="w-full h-auto object-contain drop-shadow-2xl"
                 className="
    object-contain
    [mask-image:radial-gradient(circle_at_center,black_45%,transparent_67%)]
  "
              />
            </div>
          </div>
          {/* Stats */}
          {/* <div className="grid grid-cols-2 gap-8">
            {[
              { value: "500+", label: "Clients Worldwide" },
              { value: "15+", label: "Years Experience" },
              { value: "98%", label: "Client Satisfaction" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center lg:text-left p-6 rounded-lg bg-primary-foreground/5"
              >
                <p className="text-3xl lg:text-4xl font-semibold text-primary-foreground">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-primary-foreground/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div> */}
        </div>
      </div>
    </section>
  );
}
