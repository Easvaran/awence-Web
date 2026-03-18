import Link from "next/link";
import Image from "next/image";

interface FooterLink {
  href: string;
  label: string;
}

const footerLinks: {
  navigation: FooterLink[];
  services: FooterLink[];
  legal: FooterLink[];
} = {
  navigation: [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    // { href: "/industries", label: "Industries" },
    // { href: "/testimonials", label: "Testimonials" },
    { href: "/contact", label: "Contact" },
    { href: "/projects", label: "Projects" },
    { href: "/employee/dashboard", label: "Employee Portal" },
  ],
  services: [
    { href: "/services#customer-support", label: "Customer Support" },
    { href: "/services#back-office", label: "Back Office" },
    { href: "/services#data-processing", label: "Data Processing" },
    { href: "/services#digital-transformation", label: "Digital Transformation" },
  ],
  legal: [
    // { href: "/privacy", label: "Privacy Policy" },
    // { href: "/terms", label: "Terms of Service" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/login?role=employee" className="inline-block">
              <div className="relative h-25 w-40  p-2">
                <Image
                  src="/images/logo.png"
                  alt="Awence"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <p className="mt-2 text-sm text-primary-foreground/70 leading-relaxed max-w-xs">
              Empowering businesses with modern TECH solutions. Your success is our priority.
            </p>
            <p className="mt-6 text-sm text-primary-foreground/60">
              support@awence.com
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Contact
            </h3>
            <address className="not-italic text-sm text-primary-foreground/70 space-y-2">
              <p>No 8, Bharathi Nagar, GH Road,</p>
              <p>Thirumangalam, Madurai 625706</p>
              <p className="mt-4">+91 77086 65431</p>
            </address>
            <div className="mt-6 pt-6 border-t border-primary-foreground/10">
              <ul className="space-y-2">
                {footerLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs text-primary-foreground/50 hover:text-primary-foreground/70 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10">
          <p className="text-xs text-primary-foreground/50 text-center">
            © {new Date().getFullYear()} Awence. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
