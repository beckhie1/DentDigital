import Link from "next/link";

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
      </svg>
    ),
    title: "SEO & Content",
    description:
      "Dominate search rankings with data-driven SEO strategies and compelling content that converts.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
      </svg>
    ),
    title: "Social Media",
    description:
      "Build a loyal community and amplify your brand across every major social platform.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    title: "PPC & Paid Ads",
    description:
      "Maximise your ROI with precision-targeted Google and Meta advertising campaigns.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Web Design & Dev",
    description:
      "Stunning, fast, conversion-optimised websites built on modern tech stacks.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    title: "Email Marketing",
    description:
      "Nurture leads and drive repeat business with high-impact email sequences and automation.",
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Analytics & Reporting",
    description:
      "Clear, actionable insights with custom dashboards and monthly performance reports.",
  },
];

const stats = [
  { value: "150+", label: "Clients Served" },
  { value: "£12M+", label: "Revenue Generated" },
  { value: "98%", label: "Client Retention" },
  { value: "5★", label: "Average Rating" },
];

const testimonials = [
  {
    quote:
      "DentDigital tripled our organic traffic in just six months. Their team is responsive, creative, and genuinely invested in our success.",
    author: "Sarah Mitchell",
    role: "CEO, Bloom Retail",
  },
  {
    quote:
      "The paid ads strategy they built for us delivered a 4× ROAS from month one. Absolutely outstanding results.",
    author: "James Okonkwo",
    role: "Founder, UrbanBite",
  },
  {
    quote:
      "From brand identity to a fully live website in four weeks. DentDigital set the bar for what an agency should be.",
    author: "Priya Sharma",
    role: "Marketing Director, NovaTech",
  },
];

const portfolioItems = [
  {
    category: "SEO",
    title: "Bloom Retail – 3× Organic Growth",
    description: "Comprehensive SEO overhaul that drove 200% more organic traffic within 6 months.",
    color: "from-violet-500 to-indigo-600",
  },
  {
    category: "Paid Ads",
    title: "UrbanBite – 4× ROAS",
    description: "Google & Meta campaign restructure that quadrupled return on ad spend.",
    color: "from-pink-500 to-rose-600",
  },
  {
    category: "Web Design",
    title: "NovaTech – Brand Relaunch",
    description: "Full brand identity and website redesign, live in under four weeks.",
    color: "from-amber-500 to-orange-600",
  },
];

export default function Home() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-indigo-100 opacity-40 [mask-image:linear-gradient(to_bottom,white,transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-40 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-6 tracking-wide">
            🚀 Award-Winning Digital Marketing
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight mb-6">
            Grow Your Brand<br />
            <span className="text-indigo-600">Digitally.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10">
            DentDigital is a full-service digital marketing agency that turns ambitious
            brands into market leaders through SEO, paid media, social, and stunning web design.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Start Your Growth
            </Link>
            <Link
              href="/portfolio"
              className="px-8 py-4 rounded-full border-2 border-gray-200 text-gray-700 font-bold text-lg hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              See Our Work
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-indigo-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-extrabold text-white mb-1">{s.value}</div>
                <div className="text-indigo-200 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">What We Do</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              End-to-end digital marketing services designed to deliver measurable results.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-8 rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-5 group-hover:bg-indigo-100 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/services"
              className="inline-flex items-center px-6 py-3 rounded-full border-2 border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
            >
              Explore All Services →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Portfolio preview ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Recent Work</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A snapshot of the results we&apos;ve delivered for our clients.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems.map((item) => (
              <div key={item.title} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group">
                <div className={`bg-gradient-to-br ${item.color} h-48 flex items-center justify-center`}>
                  <span className="text-white/80 text-sm font-semibold uppercase tracking-widest">
                    {item.category}
                  </span>
                </div>
                <div className="bg-white p-6">
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/portfolio"
              className="inline-flex items-center px-6 py-3 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
            >
              View Full Portfolio →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">What Clients Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.author} className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="text-indigo-600 text-3xl mb-4">&ldquo;</div>
                <p className="text-gray-700 leading-relaxed mb-6">{t.quote}</p>
                <div>
                  <div className="font-bold text-gray-900">{t.author}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-gradient-to-br from-indigo-600 to-violet-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to accelerate your growth?
          </h2>
          <p className="text-indigo-200 text-xl mb-10">
            Let&apos;s build a strategy that gets results. Talk to our team today — no strings attached.
          </p>
          <Link
            href="/contact"
            className="inline-block px-10 py-4 rounded-full bg-white text-indigo-700 font-bold text-lg hover:bg-indigo-50 transition-colors shadow-xl"
          >
            Book a Free Strategy Call
          </Link>
        </div>
      </section>
    </>
  );
}
