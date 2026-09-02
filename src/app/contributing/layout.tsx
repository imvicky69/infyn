import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contributing to Infyn — Open Source Developer & Architecture Guide",
  description:
    "Complete developer guide for contributing to Infyn. Learn our 100% client-side zero-cloud architecture, step-by-step tool blueprint, shared components, and pull request checklist.",
  keywords: [
    "contribute to infyn",
    "open source image tools",
    "open source pdf tools",
    "client side web tools",
    "wasm browser utilities",
    "infyn developer guide",
  ],
  alternates: {
    canonical: "https://infyn.software/contributing",
  },
  openGraph: {
    title: "Contributing to Infyn — Open Source Developer Guide",
    description:
      "Build fast, private, 100% in-browser utilities with zero cloud uploads. Step-by-step blueprint, shared component library, and PR checklist.",
    url: "https://infyn.software/contributing",
    siteName: "Infyn",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Contributing to Infyn — Open Source Developer Guide",
  description:
    "Engineering standards, design system rules, and step-by-step procedures for building private client-side utilities on Infyn.",
  url: "https://infyn.software/contributing",
  author: {
    "@type": "Organization",
    name: "Infyn by Indivio",
    url: "https://infyn.software",
  },
};

export default function ContributingLayout({
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
