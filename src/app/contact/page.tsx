import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact – DentDigital",
  description:
    "Get in touch with DentDigital. Book a free strategy call or send us a message — we'd love to hear about your project.",
};

const contactDetails = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "Email",
    value: "hello@dentdigital.com",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    label: "Phone",
    value: "+44 (0) 20 7946 0958",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Office",
    value: "14 Soho Square, London, W1D 3QG",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">Let&apos;s Talk</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ready to grow? Fill in the form and we&apos;ll be in touch within one business day.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-16">
          {/* Contact info */}
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-10 leading-relaxed">
              Whether you&apos;re looking for a full-service marketing partner or just need help
              with a specific campaign, we&apos;d love to hear from you. No pushy sales calls —
              just a genuine conversation about what&apos;s possible.
            </p>

            <div className="space-y-6">
              {contactDetails.map((detail) => (
                <div key={detail.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                    {detail.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">
                      {detail.label}
                    </div>
                    <div className="text-gray-800 font-medium">{detail.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-indigo-50 rounded-2xl">
              <h3 className="font-bold text-gray-900 mb-2">Response Time</h3>
              <p className="text-sm text-gray-600">
                We aim to respond to all enquiries within 1 business day.
                For urgent projects, call us directly and we&apos;ll fast-track your brief.
              </p>
            </div>
          </div>

          {/* Client component form */}
          <ContactForm />
        </div>
      </section>
    </>
  );
}
