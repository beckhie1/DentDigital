import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us – DentDigital",
  description:
    "Learn about DentDigital – our story, our values, and the team behind your digital growth.",
};

const values = [
  {
    title: "Results-First",
    description:
      "Every strategy we build is anchored in measurable outcomes — traffic, leads, revenue.",
  },
  {
    title: "Radical Transparency",
    description:
      "No jargon, no vanity metrics. Clear reporting that tells you exactly what your money is doing.",
  },
  {
    title: "Always Learning",
    description:
      "The digital landscape changes daily. Our team stays ahead so you never fall behind.",
  },
  {
    title: "Partnership Mindset",
    description:
      "We treat your business like our own. Your wins are our wins.",
  },
];

const team = [
  {
    name: "Alex Dent",
    role: "Founder & CEO",
    bio: "10+ years building brands online. Previously led growth at two SaaS unicorns.",
    initials: "AD",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    name: "Mia Chen",
    role: "Head of SEO",
    bio: "Former Google engineer turned SEO strategist. Has led campaigns generating £5M+ in organic revenue.",
    initials: "MC",
    color: "bg-violet-100 text-violet-700",
  },
  {
    name: "Jordan Banks",
    role: "Creative Director",
    bio: "Award-winning designer with a portfolio spanning fintech, e-commerce, and SaaS brands.",
    initials: "JB",
    color: "bg-pink-100 text-pink-700",
  },
  {
    name: "Priya Patel",
    role: "Head of Paid Media",
    bio: "Manages £2M+ in ad spend annually across Google, Meta, TikTok, and LinkedIn.",
    initials: "PP",
    color: "bg-amber-100 text-amber-700",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-4">
              Our Story
            </span>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
              We exist to make your brand impossible to ignore.
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              DentDigital was founded with a simple belief: great marketing should be accessible,
              measurable, and genuinely effective. Since day one we&apos;ve partnered with
              ambitious businesses to drive real, lasting growth through smart digital strategy.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We help businesses of every size compete in the digital space — not by following
              trends, but by building strategies rooted in data, creativity, and an obsession
              with client outcomes.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From startups finding their footing to established brands ready to scale, we craft
              bespoke marketing solutions that generate sustainable growth.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Founded", value: "2018" },
              { label: "Clients", value: "150+" },
              { label: "Countries", value: "12" },
              { label: "Team members", value: "25+" },
            ].map((s) => (
              <div key={s.label} className="bg-indigo-50 rounded-2xl p-6">
                <div className="text-3xl font-extrabold text-indigo-600 mb-1">{s.value}</div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide every decision we make.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-2">{v.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">Meet the Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Specialists who live and breathe digital marketing.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div
                  className={`w-20 h-20 rounded-full ${member.color} flex items-center justify-center text-2xl font-bold mx-auto mb-4`}
                >
                  {member.initials}
                </div>
                <h3 className="font-bold text-gray-900">{member.name}</h3>
                <div className="text-indigo-600 text-sm font-medium mb-2">{member.role}</div>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Let&apos;s build something great together
          </h2>
          <p className="text-indigo-200 mb-8">
            Talk to our team and find out what&apos;s possible for your brand.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 rounded-full bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </>
  );
}
