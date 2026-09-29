"use client";

import * as React from "react";
import Link from "next/link";
import {
  Video,
  Images,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Download,
  Users,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { GoogleAd, DEFAULT_ADSENSE_SLOT } from "@/components/ads/google-ad";

function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

const INSTAGRAM_TOOLS = [
  {
    href: "/instagram/reel-downloader",
    title: "Instagram Reel Downloader",
    badge: "HD MP4",
    badgeColor: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60",
    gradient: "linear-gradient(135deg, rgba(244,63,94,0.15), rgba(168,85,247,0.15))",
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBorder: "border-rose-200/80 dark:border-rose-800/60",
    description:
      "Paste any public Instagram Reel or video link to preview in-browser, stream HD MP4, extract pristine M4A background music, and download cover images.",
    features: [
      "1080p Full HD MP4 Video",
      "M4A Background Audio Extraction",
      "Zero Watermarks or Compression",
      "Built-in Video Player Preview",
    ],
    cta: "Launch Reel Downloader",
    icon: <Video className="h-6 w-6" />,
  },
  {
    href: "/instagram/profile-downloader",
    title: "Instagram Profile Picture Downloader",
    badge: "HD DP",
    badgeColor: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60",
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.15), rgba(59,130,246,0.15))",
    iconColor: "text-purple-600 dark:text-purple-400",
    iconBorder: "border-purple-200/80 dark:border-purple-800/60",
    description:
      "View and download full-size Instagram profile pictures (DP) in high definition. Simply enter any username to extract the original avatar via lightweight HTML query.",
    features: [
      "Full Resolution Original Avatar",
      "Works for Public & Private Accounts",
      "Follower & Following Stats",
      "100% Anonymous • Zero Login Needed",
    ],
    cta: "Launch Profile Downloader",
    icon: <Images className="h-6 w-6" />,
  },
];

export default function InstagramToolsHubPage() {
  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* ── Hero Header ───────────────────────────────────── */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold shadow-2xs">
            <InstagramIcon className="h-3.5 w-3.5" />
            <span>Fast, Free & 100% In-Browser</span>
          </div>

          <SplitText
            text="Instagram Tools & Downloaders"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white"
            delay={25}
            duration={0.6}
            splitType="words"
          />

          <p className="text-sm sm:text-base text-[#6E6D68] dark:text-zinc-400 font-medium leading-relaxed">
            Download Reels, high-quality audio tracks, and full-resolution profile pictures (DP)
            directly in your browser with zero logins and zero watermarks.
          </p>
        </div>

        {/* ── Tools Grid ────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {INSTAGRAM_TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group p-6 sm:p-7 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] hover:border-rose-300 dark:hover:border-rose-800 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    style={{ background: tool.gradient }}
                    className={`h-12 w-12 rounded-2xl border ${tool.iconBorder} flex items-center justify-center ${tool.iconColor} shadow-2xs group-hover:scale-105 transition-transform`}
                  >
                    {tool.icon}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${tool.badgeColor}`}
                  >
                    {tool.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#111111] dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                {/* Feature Bullet List */}
                <div className="space-y-2 pt-2 border-t border-[#F5F4EE] dark:border-zinc-800/80">
                  {tool.features.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-[#6E6D68] dark:text-zinc-300 font-medium"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <div className="w-full py-3 px-4 rounded-2xl bg-[#F5F4EE] dark:bg-zinc-800 group-hover:bg-[#111111] dark:group-hover:bg-white text-[#111111] dark:text-white group-hover:text-white dark:group-hover:text-[#111111] text-xs font-extrabold flex items-center justify-center gap-2 transition-all shadow-2xs">
                  <span>{tool.cta}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── Sponsored Google Ad Slot (Auto-Collapses if Unfilled) ── */}
        <div className="max-w-4xl mx-auto w-full">
          <GoogleAd
            slot={DEFAULT_ADSENSE_SLOT}
            minHeight={120}
            label="Sponsored"
            collapseWhenUnfilled={true}
          />
        </div>

        {/* ── Value Props ──────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto pt-4">
          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-9 w-9 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Zap className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              No Software Required
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Every tool runs directly inside your web browser on mobile or desktop without
              external downloads.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-9 w-9 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              Zero Login & Anonymous
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Never requires your Instagram password or account. Completely anonymous queries
              keep you secure.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-9 w-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Download className="h-4 w-4" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              100% Free & Unlimited
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              No subscriptions, credit cards, or daily limits. Free for everyone, forever.
            </p>
          </div>
        </div>

        {/* ── Privacy Badges ───────────────────────────────── */}
        <div className="pt-4">
          <PrivacyBadges
            badges={[
              "100% In-browser preview",
              "Zero account login",
              "100% Free & Unlimited",
              "No Watermarks",
            ]}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
