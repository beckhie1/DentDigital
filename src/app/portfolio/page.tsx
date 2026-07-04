import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio – DentDigital",
  description:
    "See the results DentDigital has delivered for clients across SEO, paid media, social, and web design.",
};

const caseStudies = [
  {
    category: "SEO & Content",
    title: "Bloom Retail – 3× Organic Traffic in 6 Months",
    description:
      "A national e-commerce retailer struggling with stagnant traffic. We rebuilt their site architecture, created 80 pieces of pillar content, and earned 200+ high-authority backlinks. Organic sessions grew 312% within six months.",
    results: ["+312% organic sessions", "+185% revenue from organic", "Page 1 for 45 target keywords"],
    color: "from-violet-500 to-indigo-600",
  },
  {
    category: "PPC & Paid Ads",
    title: "UrbanBite – 4× ROAS on Google & Meta",
    description:
      "A D2C food brand spending £15k/month on ads with poor returns. We restructured their entire campaign architecture, rebuilt audiences from first-party data, and introduced creative testing at scale. ROAS went from 1.1× to 4.3× in 90 days.",
    results: ["4.3× ROAS achieved", "£40k in new monthly revenue", "CPA reduced by 68%"],
    color: "from-pink-500 to-rose-600",
  },
  {
    category: "Web Design & Dev",
    title: "NovaTech – Full Brand & Website Relaunch",
    description:
      "A B2B SaaS startup needing a brand identity and website to support a Series A raise. We delivered a complete brand system, marketing site, and onboarding flow in under four weeks — built on Next.js and deployed on Vercel.",
    results: ["Launched in 28 days", "Core Web Vitals score 98/100", "3× increase in demo requests"],
    color: "from-amber-500 to-orange-600",
  },
  {
    category: "Social Media",
    title: "Solace Wellness – 0 to 80k Followers in 12 Months",
    description:
      "A wellness brand entering a saturated market. We built an organic-first content strategy on Instagram and TikTok, producing short-form video, UGC campaigns, and a monthly influencer programme. Follower count grew from zero to 80k with strong engagement.",
    results: ["80k followers gained", "4.8% average engagement rate", "£220k attributed social revenue"],
    color: "from-teal-500 to-emerald-600",
  },
  {
    category: "Email Marketing",
    title: "Peak Performance – 38% Email Revenue Lift",
    description:
      "A sports nutrition brand with an underutilised list of 120k subscribers. We rebuilt their Klaviyo flows, segmented by purchase behaviour, and launched a 12-email welcome series. Email revenue increased 38% in the first quarter.",
    results: ["+38% email revenue", "52% open rate on welcome series", "18× ROI on email programme"],
    color: "from-sky-500 to-blue-600",
  },
  {
    category: "Analytics",
    title: "Clearview Finance – GA4 & Attribution Overhaul",
    description:
      "A financial services firm flying blind without proper analytics. We implemented GA4, server-side GTM, and a Looker Studio dashboard giving real-time visibility across all channels. Decision-making time reduced by 60%.",
    results: ["100% data accuracy", "Custom real-time dashboards", "60% faster reporting"],
    color: "from-slate-500 to-gray-700",
  },
];

export default function PortfolioPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Our Work</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real results for real businesses. Here&apos;s a selection of what we&apos;ve
            delivered for our clients.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {caseStudies.map((cs, index) => (
            <div
              key={cs.title}
              className={`rounded-2xl overflow-hidden border border-gray-100 shadow-sm flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Colour panel */}
              <div
                className={`bg-gradient-to-br ${cs.color} md:w-2/5 flex flex-col items-center justify-center p-10 min-h-[220px]`}
              >
                <span className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">
                  {cs.category}
                </span>
                <div className="flex flex-col gap-3">
                  {cs.results.map((r) => (
                    <div key={r} className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-white/80 flex-shrink-0"
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
                      <span className="text-white font-semibold text-sm">{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Text panel */}
              <div className="md:w-3/5 p-10 flex flex-col justify-center bg-white">
                <h2 className="text-2xl font-extrabold text-gray-900 mb-4">{cs.title}</h2>
                <p className="text-gray-600 leading-relaxed">{cs.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-indigo-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4">
            Could your business be our next success story?
          </h2>
          <p className="text-indigo-200 mb-8">
            Let&apos;s talk about what&apos;s possible for your brand.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 rounded-full bg-white text-indigo-700 font-bold hover:bg-indigo-50 transition-colors"
          >
            Start the Conversation
          </Link>
        </div>
      </section>
    </>
  );
}
