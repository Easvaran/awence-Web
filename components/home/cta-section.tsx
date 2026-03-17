import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-12 lg:py-16 bg-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-semibold text-primary-foreground leading-tight max-w-2xl mx-auto text-balance">
          Ready to transform your business operations?
        </h2>
        <p className="mt-6 text-lg text-primary-foreground/70 max-w-xl mx-auto">
          Let's discuss how Awence can help you achieve operational excellence and drive growth.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent">
            <Link href="/services">Explore Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
