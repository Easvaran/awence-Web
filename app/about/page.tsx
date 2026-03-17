import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { CTASection } from "@/components/home/cta-section";
import { Target, Eye, Users, Award, Globe, Clock, Linkedin, Github } from "lucide-react";
import Image from "next/image";

const values = [
  {
    icon: Target,
    title: "Excellence",
    description: "We strive for excellence in every interaction and deliverable.",
  },
  {
    icon: Users,
    title: "Partnership",
    description: "We build lasting partnerships based on trust and mutual success.",
  },
  {
    icon: Award,
    title: "Innovation",
    description: "We continuously evolve our processes and embrace new technologies.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description: "We serve clients worldwide with localized expertise and support.",
  },
];

const milestones = [
  { year: "2008", event: "Founded with a vision to transform business operations" },
  { year: "2012", event: "Expanded to serve 100+ enterprise clients globally" },
  { year: "2016", event: "Opened operations centers in Asia and Europe" },
  { year: "2020", event: "Launched digital transformation services" },
  { year: "2024", event: "Serving 500+ clients across 40+ countries" },
];

const teamMembers = [
  {
    name: "Ramasamy R",
    role: "Chief Executive Officer",
    bio: "Experience in business process management and enterprise solutions.",
    image: "/images/ramasamy.jpeg",
    linkedin: "https://www.linkedin.com/in/r-ramasamy-864009293",
    github: "",
  },
  {
    name: "Dinesh Kumar R",
    role: "Business Development Manager",
    bio: "Technology innovator with a passion for automation and AI-driven solutions.",
    image: "/images/dinesh.jpeg",
    linkedin: "https://www.linkedin.com/in/dineshkumar-r-404946366",
    github: "",
  },
  {
    name: "Rajadharshini M",
    role: "Operation Manager",
    bio: "Dedicated to ensuring every client achieves their operational goals.",
    image: "/images/dharshini.png",
    linkedin: "https://linkedin.com/in/hariharan14022002",
    github: "",
  },
  // {
  //   name: "Lisa Thompson",
  //   role: "VP of Client Success",
  //   bio: "",
  // },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="pt-16 lg:pt-20">
        {/* Hero Section */}
        <section className="py-12 lg:py-16 bg-foreground">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-widest text-primary-foreground/60 mb-6">
                About Awence
              </p>
              <h1 className="text-4xl lg:text-5xl font-semibold text-primary-foreground leading-tight text-balance">
                Dedicated to operational excellence and business growth
              </h1>
              {/* <p className="mt-6 text-lg text-primary-foreground/70 leading-relaxed">
                Since 2008, Awence has been at the forefront of business process outsourcing, helping organizations worldwide optimize their operations and achieve sustainable growth.
              </p> */}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16">
              <div className="p-8 lg:p-12 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-foreground">
                    <Target className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Our Mission</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To empower businesses of all sizes to achieve operational excellence through innovative outsourcing solutions, cutting-edge technology, and dedicated partnership. We believe in transforming challenges into opportunities for growth.
                </p>
              </div>
              <div className="p-8 lg:p-12 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-md bg-foreground">
                    <Eye className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Our Vision</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  To be the world's most trusted BPO partner, recognized for our commitment to quality, innovation, and the success of our clients. We envision a future where every business can access world-class operational support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12 lg:py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Our Values
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
                What drives us every day
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center p-6">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-background border border-border mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        {/* <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="max-w-2xl mb-16">
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Our Journey
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
                Key milestones in our growth
              </h2>
            </div>
            <div className="relative">
              <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-px bg-border lg:-translate-x-px" />
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center gap-8 ${
                      index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                    }`}
                  >
                    <div className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"} hidden lg:block`}>
                      <div className={`inline-block p-6 bg-muted/50 rounded-lg max-w-md ${index % 2 === 0 ? "ml-auto" : "mr-auto"}`}>
                        <p className="text-2xl font-semibold text-foreground mb-2">
                          {milestone.year}
                        </p>
                        <p className="text-muted-foreground">
                          {milestone.event}
                        </p>
                      </div>
                    </div>
                    <div className="absolute left-4 lg:left-1/2 w-3 h-3 rounded-full bg-foreground -translate-x-1/2 lg:-translate-x-1.5" />
                    <div className="flex-1 pl-12 lg:pl-0 lg:hidden">
                      <p className="text-2xl font-semibold text-foreground mb-2">
                        {milestone.year}
                      </p>
                      <p className="text-muted-foreground">
                        {milestone.event}
                      </p>
                    </div>
                    <div className="flex-1 hidden lg:block" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section> */}

        {/* Leadership Team */}
        <section className="py-12 lg:py-16 bg-muted/50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">
                Leadership
              </p>
              <h2 className="text-3xl lg:text-4xl font-semibold text-foreground">
                Meet our leadership team
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={index}
                  className="
        group relative bg-background
        rounded-2xl border border-border
        p-6 text-center
        transition-all duration-300
        hover:-translate-y-1 hover:shadow-xl
      "
                >
                  {/* Avatar */}
                  <div className="flex justify-center -mt-14 mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-background shadow-lg bg-muted">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={96}
                        height={96}
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-lg font-semibold text-foreground tracking-tight">
                    {member.name}
                  </h3>

                  {/* Role */}
                  <p className="text-sm text-primary font-medium mt-1">
                    {member.role}
                  </p>

                  {/* Divider */}
                  <div className="w-12 h-px bg-border mx-auto my-4" />

                  {/* Bio */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>

                  <div className="mt-6 flex justify-center gap-4 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-border text-muted-foreground hover:text-primary hover:bg-muted transition"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {member.github && (
                      <a
                        href={member.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-full border border-border text-muted-foreground hover:text-primary hover:bg-muted transition"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Stats */}
        {/* <section className="py-12 lg:py-16 bg-background">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { icon: Users, value: "5,000+", label: "Team Members" },
                { icon: Globe, value: "40+", label: "Countries Served" },
                { icon: Award, value: "15+", label: "Industry Awards" },
                { icon: Clock, value: "24/7", label: "Global Operations" },
              ].map((stat, index) => (
                <div key={index} className="p-8 border border-border rounded-lg">
                  <stat.icon className="w-8 h-8 text-foreground mx-auto mb-4" />
                  <p className="text-4xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        <CTASection />
      </main>
      <Footer />
    </>
  );
}
