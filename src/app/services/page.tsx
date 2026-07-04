import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services – DentDigital",
  description:
    "Explore DentDigital's full range of digital marketing services: SEO, social media, PPC, web design, email marketing, and analytics.",
};

const services = [
  {
    icon: "🔍",
    title: "SEO & Content Marketing",
    description:
      "We audit, optimise, and build sustainable search visibility for your brand through technical SEO, on-page optimisation, and authoritative content creation.",
    outcomes: [
      "Higher organic rankings & visibility",
      "Increased qualified website traffic",
      "Authoritative, long-form content",
      "Technical SEO health audits",
    ],
    color: "bg-indigo-50 border-indigo-200",
    badge: "Most Popular",
  },
  {
    icon: "📣",
    title: "Social Media Marketing",
    description:
      "From strategy and creative production to community management and paid boosts — we build thriving social presences that convert followers into customers.",
    outcomes: [
      "Platform strategy & content calendars",
      "Creative design & copywriting",
      "Community management",
      "Influencer partnerships",
    ],
    color: "bg-violet-50 border-violet-200",
    badge: null,
  },
  {
    icon: "💸",
    title: "PPC & Paid Advertising",
    description:
      "Precision-targeted campaigns on Google, Meta, TikTok, and LinkedIn that put your brand in front of the right people at the right moment.",
    outcomes: [
      "Google Ads & Shopping campaigns",
      "Meta & TikTok performance ads",
      "LinkedIn B2B advertising",
      "Retargeting & audience building",
    ],
    color: "bg-pink-50 border-pink-200",
    badge: null,
  },
  {
    icon: "🖥️",
    title: "Web Design & Development",
    description:
      "Beautiful, blazing-fast websites that are built to convert. We design, develop, and optimise on Next.js and WordPress, ready for Vercel deployment.",
    outcomes: [
      "Conversion-focused UX/UI design",
      "Next.js & WordPress development",
      "CRO and A/B testing",
      "Speed & Core Web Vitals optimisation",
    ],
    color: "bg-amber-50 border-amber-200",
    badge: null,
  },
  {
    icon: "✉️",
    title: "Email Marketing & Automation",
    description:
      "Drive repeat purchases and nurture leads with beautifully designed email sequences, newsletters, and lifecycle automation.",
    outcomes: [
      "List segmentation & management",
      "Drip sequences & automation",
      "Newsletter design & copywriting",
      "Klaviyo, Mailchimp & HubSpot",
    ],
    color: "bg-teal-50 border-teal-200",
    badge: null,
  },
  {
    icon: "📊",
    title: "Analytics & Reporting",
    description:
      "Understand exactly what&apos;s working with custom dashboards, attribution modelling, and monthly strategy calls.",
    outcomes: [
      "GA4 & GTM setup & management",
      "Custom Looker Studio dashboards",
      "Monthly performance reviews",
      "Attribution & conversion tracking",
    ],
    color: "bg-green-50 border-green-200",
    badge: null,
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Services Built to Drive Growth
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Everything your brand needs to dominate the digital space — under one roof.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.title}
                className={`relative rounded-2xl border-2 p-8 ${service.color}`}
              >
                {service.badge && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold">
                    {service.badge}
                  </span>
                )}
                <div className="text-4xl mb-4">{service.icon}</div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.outcomes.map((o) => (
                    <li key={o} className="flex items-start gap-2 text-sm text-gray-700">
                      <svg
                        className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">How We Work</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A proven process that delivers results, every time.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Discovery", desc: "We learn everything about your business, goals, and competition." },
              { step: "02", title: "Strategy", desc: "We build a bespoke roadmap tailored to your specific growth targets." },
              { step: "03", title: "Execution", desc: "Our team implements with precision, speed, and creativity." },
              { step: "04", title: "Optimise", desc: "We continuously test, learn, and refine to maximise your ROI." },
            ].map((p) => (
              <div key={p.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white text-sm font-extrabold flex items-center justify-center mx-auto mb-4">
                  {p.step}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Not sure where to start?
          </h2>
          <p className="text-indigo-200 mb-8">
            Book a free 30-minute strategy call and we&apos;ll tell you exactly what will move the needle for your business.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 rounded-full bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-colors"
          >
            Book Free Strategy Call
          </Link>
        </div>
      </section>
    </>
  );
}
