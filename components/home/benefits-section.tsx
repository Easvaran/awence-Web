import { Check } from "lucide-react";

const benefits = [
  {
    title: "Cost Efficiency",
    description: "Reduce operational costs by up to 60% while maintaining the highest quality standards.",
  },
  {
    title: "Scalable Solutions",
    description: "Easily scale your operations up or down based on your business needs and seasonal demands.",
  },
  {
    title: "Expert Teams",
    description: "Access highly trained professionals with industry-specific expertise and certifications.",
  },
  {
    title: "24/7 Operations",
    description: "Round-the-clock services ensure your business never sleeps and customers are always served.",
  },
  {
    title: "Advanced Technology",
    description: "Leverage cutting-edge tools and platforms to optimize your business processes.",
  },
  {
    title: "Compliance & Security",
    description: "Rigorous data protection and compliance with international standards and regulations.",
  },
];

export function BenefitsSection() {
  return (
    <section className="py-12 lg:py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Why Choose Us
            </p>
            <h2 className="text-3xl lg:text-4xl font-semibold text-foreground leading-tight text-balance">
              A global approach for a future-ready business model
            </h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              We combine deep industry expertise with innovative technology to deliver BPO solutions that drive real business results.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="p-6 bg-background rounded-lg border border-border"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground">
                    <Check className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
