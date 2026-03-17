import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CTASection } from "@/components/home/cta-section";
import { Quote, Star, Building2, Users } from "lucide-react";

const testimonials = [
  {
    quote:
      "Awence transformed our customer service operations. Response times improved by 40% and customer satisfaction scores have never been higher. Their team truly feels like an extension of our own.",
    author: "Sarah Mitchell",
    role: "VP of Operations",
    company: "TechCorp Inc.",
    industry: "Technology",
    rating: 5,
  },
  {
    quote:
      "The professionalism and expertise of the Awence team exceeded our expectations. They truly understand enterprise-level requirements and delivered a solution that scales with our growth.",
    author: "Michael Chen",
    role: "CEO",
    company: "Global Retail Solutions",
    industry: "Retail",
    rating: 5,
  },
  {
    quote:
      "Partnering with Awence allowed us to scale our operations globally while maintaining consistent quality across all touchpoints. Their 24/7 support has been invaluable for our international customers.",
    author: "Emily Rodriguez",
    role: "COO",
    company: "FinanceHub",
    industry: "Financial Services",
    rating: 5,
  },
  {
    quote:
      "The data processing and analytics services have given us insights we never had before. Awence's team helped us make data-driven decisions that improved our bottom line by 25%.",
    author: "David Park",
    role: "Director of Analytics",
    company: "Healthcare Plus",
    industry: "Healthcare",
    rating: 5,
  },
  {
    quote:
      "We've worked with several BPO providers over the years, but Awence stands out for their attention to detail and commitment to quality. They've become an essential partner in our operations.",
    author: "Jennifer Walsh",
    role: "Head of Customer Experience",
    company: "TravelMax",
    industry: "Travel & Hospitality",
    rating: 5,
  },
  {
    quote:
      "The digital transformation services helped us modernize our legacy systems without disrupting our daily operations. The ROI has been exceptional—we've reduced processing time by 60%.",
    author: "Robert Kim",
    role: "CTO",
    company: "Manufacturing Corp",
    industry: "Manufacturing",
    rating: 5,
  },
  {
    quote:
      "Awence's HIPAA-compliant solutions gave us the confidence to outsource sensitive processes. Their compliance expertise and security measures are top-notch.",
    author: "Amanda Foster",
    role: "VP of Operations",
    company: "MedCare Systems",
    industry: "Healthcare",
    rating: 5,
  },
  {
    quote:
      "The back-office support team has been incredible. They handle our administrative tasks with such efficiency that our internal team can now focus entirely on strategic initiatives.",
    author: "James Thompson",
    role: "Operations Manager",
    company: "Property Solutions Inc.",
    industry: "Real Estate",
    rating: 5,
  },
  {
    quote:
      "Outstanding service from start to finish. The onboarding process was smooth, and we were fully operational within weeks. Their industry knowledge made all the difference.",
    author: "Lisa Chen",
    role: "Director of Operations",
    company: "EduTech Global",
    industry: "Education",
    rating: 5,
  },
];

const stats = [
  { icon: Building2, value: "500+", label: "Satisfied Clients" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
  { icon: Users, value: "98%", label: "Client Retention" },
];

export default function TestimonialsPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-foreground">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60 mb-6">
                Testimonials
              </p>
              <h1 className="text-4xl lg:text-5xl font-semibold text-primary-foreground leading-tight text-balance">
                What our clients say about us
              </h1>
              <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed">
                Don't just take our word for it. Hear from the businesses that have transformed their operations with Awence.
              </p>
            </div>

            {/* Stats */}
            <div className="mt-16 grid sm:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-6 rounded-lg bg-primary-foreground/5"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary-foreground/10">
                    <stat.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-primary-foreground">
                      {stat.value}
                    </p>
                    <p className="text-sm text-primary-foreground/60">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 border border-border rounded-lg flex flex-col"
                >
                  {/* Quote Icon */}
                  <Quote className="w-10 h-10 text-muted-foreground/30 mb-4" />

                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-foreground text-foreground"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-foreground leading-relaxed flex-1">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author */}
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="font-semibold text-foreground">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {testimonial.role}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.company}
                    </p>
                    <span className="inline-block mt-3 px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                      {testimonial.industry}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Quote */}
        <section className="py-12 lg:py-16 bg-muted/50">
          <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
            <Quote className="w-16 h-16 text-muted-foreground/30 mx-auto mb-8" />
            <blockquote className="text-2xl lg:text-3xl font-medium text-foreground leading-relaxed text-balance">
              "Awence has been instrumental in our global expansion. Their ability to scale with us while maintaining exceptional quality has made them an invaluable strategic partner."
            </blockquote>
            <div className="mt-8">
              <p className="text-lg font-semibold text-foreground">
                Alexandra Wright
              </p>
              <p className="text-muted-foreground">
                Chief Operating Officer, Enterprise Solutions Global
              </p>
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
