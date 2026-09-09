import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Support Infyn — Help Keep Privacy-First Software Free & Independent",
  description:
    "Support Infyn directly via UPI. Infyn is 100% free, client-side, and ad-free software built with a focus on privacy and open source.",
  keywords: [
    "support infyn",
    "sponsor infyn",
    "infyn upi",
    "donate open source",
    "support privacy software",
    "infyn software donation",
    "client side tools sponsor",
  ],
  alternates: {
    canonical: "https://infyn.software/sponsor",
  },
  openGraph: {
    title: "Support Infyn — Free & Independent Software",
    description:
      "Infyn is built independently with a focus on privacy, useful tools, and open-source software. Support our work directly via UPI.",
    url: "https://infyn.software/sponsor",
    images: [{ url: "/logo-clear.png", width: 800, height: 800, alt: "Support Infyn" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Support Infyn",
  url: "https://infyn.software/sponsor",
  description:
    "Support Infyn directly via UPI. Help keep useful, privacy-focused in-browser software free and independent.",
};

export default function SponsorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
