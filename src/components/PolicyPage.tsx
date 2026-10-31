import React from 'react';

export const POLICY_ROUTES = {
  '/privacy-policy': 'privacy',
  '/terms-and-conditions': 'terms',
  '/refund-policy': 'refund',
  '/contact-us': 'contact',
} as const;

export type PolicyKey = (typeof POLICY_ROUTES)[keyof typeof POLICY_ROUTES];

export const POLICY_LINKS: { href: string; label: string }[] = [
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms-and-conditions', label: 'Terms & Conditions' },
  { href: '/refund-policy', label: 'Refund & Cancellation' },
  { href: '/contact-us', label: 'Contact Us' },
];

const BUSINESS = {
  name: 'Kanha Asa (Kanha Asa Astro & Rudraksha)',
  address: 'Shop No BF3/3, Shilpi Plaza, Rewa, Madhya Pradesh 486001, India',
  phone: '+91 91318 05622',
  phoneHref: 'tel:+919131805622',
  whatsapp: 'https://wa.me/919131805622',
  email: 'support@kanhaasa.com',
  site: 'rudrakshkanhaasa.shop',
};

const H2: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-xl font-semibold text-[#202124] mt-8 mb-3">{children}</h2>
);
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[#3c4043] leading-relaxed mb-3">{children}</p>
);
const UL: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="list-disc pl-6 space-y-1.5 text-[#3c4043] mb-3">
    {items.map((it, i) => (
      <li key={i}>{it}</li>
    ))}
  </ul>
);

const ContactBlock = () => (
  <div className="rounded-xl border border-[#dadce0] bg-white p-5 text-[#3c4043] space-y-1.5">
    <p className="font-semibold text-[#202124]">{BUSINESS.name}</p>
    <p>{BUSINESS.address}</p>
    <p>
      Phone / WhatsApp:{' '}
      <a className="text-amber-700 underline" href={BUSINESS.phoneHref}>
        {BUSINESS.phone}
      </a>
    </p>
    <p>
      Email:{' '}
      <a className="text-amber-700 underline" href={`mailto:${BUSINESS.email}`}>
        {BUSINESS.email}
      </a>
    </p>
    <p>Hours: Monday to Saturday, 10:00 AM to 7:00 PM IST</p>
  </div>
);

const LAST_UPDATED = '31 October 2026';

const content: Record<PolicyKey, { title: string; body: React.ReactNode }> = {
  privacy: {
    title: 'Privacy Policy',
    body: (
      <>
        <P>
          This Privacy Policy explains how {BUSINESS.name} ("Kanha Asa", "we", "us") collects, uses and
          protects your information when you use {BUSINESS.site} and buy our products or consultation services.
        </P>
        <H2>Information we collect</H2>
        <UL
          items={[
            'Name, phone number, email and shipping address you give us while ordering, booking a consultation or contacting us.',
            'Birth details (date, time and place) that you share for kundli, numerology or Lo Shu grid analysis.',
            'Order and payment details. Card, UPI and bank details are processed securely by Razorpay; we never see or store them.',
            'Basic usage data such as pages visited and device type, collected through cookies and analytics tools.',
          ]}
        />
        <H2>How we use it</H2>
        <UL
          items={[
            'To process orders, deliver products and provide consultations.',
            'To contact you on phone, WhatsApp, SMS or email about your order or booking.',
            'To improve our website, products and services.',
            'To send offers and updates, only if you agree. You can opt out any time.',
          ]}
        />
        <H2>Sharing</H2>
        <P>
          We do not sell your personal data. We share only what is needed with courier partners (for delivery),
          Razorpay (for payments), and service providers that help run this website, or when required by law.
        </P>
        <H2>Security and retention</H2>
        <P>
          We use reasonable safeguards to protect your data and keep it only as long as needed for orders,
          consultations, accounting and legal requirements.
        </P>
        <H2>Your choices</H2>
        <P>
          You can ask us to access, correct or delete your personal data by contacting us using the details below.
        </P>
        <H2>Contact</H2>
        <ContactBlock />
      </>
    ),
  },
  terms: {
    title: 'Terms & Conditions',
    body: (
      <>
        <P>
          By using {BUSINESS.site} or placing an order with {BUSINESS.name}, you agree to these terms.
        </P>
        <H2>Products</H2>
        <UL
          items={[
            'We sell natural Rudraksha, malas, gemstones, yantras and related spiritual products. Being natural, each bead may vary slightly in size, colour and shape from the photos.',
            'Prices are in Indian Rupees (INR) and include applicable taxes unless stated otherwise.',
            'We may change prices or availability without notice. Orders are confirmed only after successful payment or our confirmation.',
          ]}
        />
        <H2>Consultations</H2>
        <UL
          items={[
            'Kundli analysis, numerology, Lo Shu grid and expert-talk sessions are guidance based on Vedic astrology and traditional knowledge.',
            'They are not a substitute for medical, legal or financial advice, and results are not guaranteed.',
            'Consultation timing is shared on phone or WhatsApp after booking.',
          ]}
        />
        <H2>Payments</H2>
        <P>
          Online payments are processed by Razorpay (UPI, cards, net banking, wallets). Installment / SIP plans,
          where offered, follow the schedule shown at the time of booking; the product is dispatched as per the
          plan terms.
        </P>
        <H2>Shipping</H2>
        <P>
          We ship across India through India Post and private couriers. Orders are usually dispatched within
          2–4 working days and delivered within 5–10 working days depending on location. Tracking details are
          shared on WhatsApp or SMS.
        </P>
        <H2>Intellectual property</H2>
        <P>
          All content, images and logos on this website belong to Kanha Asa and may not be copied without
          permission.
        </P>
        <H2>Governing law</H2>
        <P>These terms are governed by the laws of India. Courts at Rewa, Madhya Pradesh have jurisdiction.</P>
        <H2>Contact</H2>
        <ContactBlock />
      </>
    ),
  },
  refund: {
    title: 'Refund & Cancellation Policy',
    body: (
      <>
        <H2>Order cancellation</H2>
        <UL
          items={[
            'You can cancel a product order before it is dispatched by contacting us on WhatsApp or phone. The full amount is refunded.',
            'Once dispatched, an order cannot be cancelled.',
            'Energised or customised items (made to your name, size or kundli) cannot be cancelled after work has started.',
          ]}
        />
        <H2>Returns and replacement</H2>
        <UL
          items={[
            'If a product arrives damaged, broken or different from what you ordered, inform us within 48 hours of delivery with an unboxing video or photos.',
            'After verification we will replace the product or issue a refund.',
            'Natural variation in size, colour or shape of beads is not a defect.',
          ]}
        />
        <H2>Consultation services</H2>
        <UL
          items={[
            'A consultation booking can be cancelled or rescheduled before the session starts for a full refund.',
            'Once the consultation or report has been delivered, the fee is non-refundable.',
          ]}
        />
        <H2>Refund timeline</H2>
        <P>
          Approved refunds are processed within 5–7 working days to the original payment method (UPI, card or
          bank account) through Razorpay.
        </P>
        <H2>Contact</H2>
        <ContactBlock />
      </>
    ),
  },
  contact: {
    title: 'Contact Us',
    body: (
      <>
        <P>
          For orders, consultations, payment or delivery questions, reach us on phone or WhatsApp. We usually
          reply within a few hours on working days.
        </P>
        <ContactBlock />
        <div className="flex flex-wrap gap-3 mt-6">
          <a
            href={BUSINESS.whatsapp}
            className="inline-flex items-center rounded-full bg-emerald-600 px-5 py-2.5 font-semibold text-white"
          >
            WhatsApp करें
          </a>
          <a
            href={BUSINESS.phoneHref}
            className="inline-flex items-center rounded-full border border-[#dadce0] px-5 py-2.5 font-semibold text-[#202124]"
          >
            Call करें
          </a>
          <a
            href="https://maps.google.com/?q=Kanha+Asa+Shop+No+BF3/3+Shilpi+Plaza+Rewa+Madhya+Pradesh+486001"
            className="inline-flex items-center rounded-full border border-[#dadce0] px-5 py-2.5 font-semibold text-[#202124]"
          >
            Google Maps
          </a>
        </div>
      </>
    ),
  },
};

export const PolicyPage: React.FC<{ page: PolicyKey }> = ({ page }) => {
  const { title, body } = content[page];
  React.useEffect(() => {
    document.title = `${title} | Kanha Asa`;
    window.scrollTo(0, 0);
  }, [title]);

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white border-b border-[#dadce0]">
        <div className="max-w-3xl mx-auto px-5 py-5 flex items-center justify-between">
          <a href="/" className="font-semibold tracking-wide text-amber-300">
            KANHA ASA
          </a>
          <a href="/" className="text-sm text-stone-300 hover:text-white">
            ← Home
          </a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-5 py-10">
        <h1 className="text-3xl font-bold text-[#202124]">{title}</h1>
        {page !== 'contact' && <p className="text-sm text-stone-500 mt-2">Last updated: {LAST_UPDATED}</p>}
        <div className="mt-6">{body}</div>
      </main>
      <footer className="border-t border-[#dadce0]">
        <div className="max-w-3xl mx-auto px-5 py-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-stone-600">
          {POLICY_LINKS.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[#202124]">
              {l.label}
            </a>
          ))}
          <span className="ml-auto">© {new Date().getFullYear()} Kanha Asa</span>
        </div>
      </footer>
    </div>
  );
};
