import Link from "next/link";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    quote: "Awence transformed our customer service operations. Response times improved by 40% and customer satisfaction scores have never been higher.",
    author: "Sarah Mitchell",
    role: "VP of Operations",
    company: "TechCorp Inc.",
  },
  {
    quote: "The professionalism and expertise of the Awence team exceeded our expectations. They truly understand enterprise-level requirements.",
    author: "Michael Chen",
    role: "CEO",
    company: "Global Retail Solutions",
  },
  {
    quote: "Partnering with Awence allowed us to scale our operations globally while maintaining consistent quality across all touchpoints.",
    author: "Emily Rodriguez",
    role: "COO",
    company: "FinanceHub",
  },
];

export function TestimonialsPreview() {
  return (
    <section className="py-12 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
            Testimonials
          </p>
          <h2 className="text-3xl lg:text-4xl font-semibold text-foreground leading-tight">
            What our clients say
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="p-8 border border-border rounded-lg"
            >
              <blockquote className="text-foreground leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              <div className="mt-6 pt-6 border-t border-border">
                <p className="font-semibold text-foreground">
                  {testimonial.author}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {testimonial.role}, {testimonial.company}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button variant="outline" asChild>
            <Link href="/testimonials">View All Testimonials</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
