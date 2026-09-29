"use client";

import * as React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Download,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Zap,
  Users,
  Image as ImageIcon,
  ChevronDown,
  AtSign,
  Maximize2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Footer } from "@/components/footer";
import SplitText from "@/components/SplitText";
import { PrivacyBadges } from "@/components/image-tools/privacy-badges";
import { GoogleAd, DEFAULT_ADSENSE_SLOT } from "@/components/ads/google-ad";
import { DownloadAdModal } from "@/components/ads/download-ad-modal";

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

interface ProfileData {
  username: string;
  fullName: string;
  profilePicUrl: string;
  downloadUrl: string;
  filename: string;
  followers?: string;
  following?: string;
  posts?: string;
  bio?: string;
}

type Stage = "idle" | "busy" | "done" | "error";

const SAMPLE_USERS = [
  { label: "Leo Messi", username: "leomessi" },
  { label: "Cristiano", username: "cristiano" },
  { label: "NASA", username: "nasa" },
  { label: "NatGeo", username: "natgeo" },
];

const FAQS = [
  {
    q: "How do I download someone's Instagram profile picture in full size?",
    a: "Simply type their Instagram username (e.g. @leomessi) or paste their profile URL into the input field above, and click 'Get Profile Picture'. We will instantly retrieve their full-size avatar for you to preview and download in HD.",
  },
  {
    q: "Do I need to log into an Instagram account?",
    a: "No! Infyn uses lightweight, public HTML queries to fetch profile pictures. You do not need an Instagram account, password, or login credentials.",
  },
  {
    q: "Can I view profile pictures of private Instagram accounts?",
    a: "Yes! On Instagram, every public and private account's profile photo is publicly accessible via their profile metadata. Our tool can display and download the DP of both public and private accounts.",
  },
  {
    q: "Will the user know that I downloaded or viewed their profile picture?",
    a: "Never. All requests are completely anonymous and routed through secure servers. Instagram never notifies users when their public profile photo is viewed or downloaded.",
  },
  {
    q: "Is this service free to use?",
    a: "Yes, 100% free with zero registration, unlimited lookups, and no added watermarks.",
  },
];

export default function InstagramProfileDownloaderPage() {
  const [inputVal, setInputVal] = useState<string>("");
  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const [downloadModal, setDownloadModal] = useState<{
    isOpen: boolean;
    url: string | null;
    filename: string;
    fileType: string;
  }>({
    isOpen: false,
    url: null,
    filename: "",
    fileType: "Profile Picture (HD)",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const handlePasteFromClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setInputVal(text.trim());
          if (inputRef.current) inputRef.current.focus();
        }
      }
    } catch {
      // User can manually paste
    }
  };

  const handleFetchProfile = async (targetUsername?: string) => {
    const rawQuery = (targetUsername || inputVal).trim();
    if (!rawQuery) {
      setErrorMsg("Please enter an Instagram username or profile link.");
      setStage("error");
      return;
    }

    setStage("busy");
    setErrorMsg("");
    setProfileData(null);

    try {
      const res = await fetch("/api/instagram/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: rawQuery }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error || "Unable to find this Instagram profile. Please check the username."
        );
      }

      setProfileData(data);
      setStage("done");
    } catch (err: any) {
      setErrorMsg(
        err.message || "An error occurred while fetching the profile picture. Please try again."
      );
      setStage("error");
    }
  };

  const handleCopyImageUrl = () => {
    if (!profileData?.profilePicUrl) return;
    navigator.clipboard.writeText(profileData.profilePicUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleDownloadWithAd = () => {
    if (!profileData) return;
    setDownloadModal({
      isOpen: true,
      url: profileData.downloadUrl,
      filename: profileData.filename,
      fileType: "Profile Picture (HD JPG)",
    });
  };

  const handleReset = () => {
    setStage("idle");
    setInputVal("");
    setProfileData(null);
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen text-[#111111] dark:text-[#EDEDEC] flex flex-col font-sans bg-[#FBFBFA] dark:bg-[#0C0C0E]">
      <Navbar />
      <Breadcrumbs />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-12">
        {/* ── Hero Header ───────────────────────────────────── */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs font-bold shadow-2xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Instant HTML Meta Query • Zero Login</span>
          </div>

          <SplitText
            text="Instagram Profile Picture Downloader"
            className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111111] dark:text-white"
            delay={25}
            duration={0.6}
            splitType="words"
          />

          <p className="text-sm sm:text-base text-[#6E6D68] dark:text-zinc-400 font-medium leading-relaxed">
            View and download full-size Instagram profile photos (HD DP) directly in your browser.
            Enter any username or profile link below.
          </p>
        </div>

        {/* ── Input Box Container ──────────────────────────── */}
        <div className="max-w-2xl mx-auto w-full space-y-3">
          <div className="p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus-within:border-rose-500 dark:focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/20 transition-all">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <div className="flex items-center gap-2.5 flex-1 px-3 py-2 sm:py-0">
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(244,63,94,0.15), rgba(168,85,247,0.15))",
                  }}
                  className="h-10 w-10 rounded-xl border border-rose-200/60 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shrink-0"
                >
                  <AtSign className="h-5 w-5" />
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => {
                    setInputVal(e.target.value);
                    if (stage === "error") setStage("idle");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && stage !== "busy") {
                      handleFetchProfile();
                    }
                  }}
                  placeholder="Enter username (e.g. leomessi) or profile URL..."
                  className="w-full bg-transparent text-sm sm:text-base text-[#111111] dark:text-white placeholder-[#9E9D98] dark:placeholder-zinc-500 outline-none"
                  disabled={stage === "busy"}
                />
                {inputVal && (
                  <button
                    onClick={() => {
                      setInputVal("");
                      if (stage !== "busy") setStage("idle");
                    }}
                    className="text-xs text-[#9E9D98] hover:text-[#111111] dark:hover:text-white px-2 py-1 rounded transition-colors shrink-0 cursor-pointer"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePasteFromClipboard}
                  title="Paste from clipboard"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#F5F4EE] dark:bg-zinc-800 hover:bg-[#EAEAE5] dark:hover:bg-zinc-700 text-[#6E6D68] dark:text-zinc-300 transition-colors shrink-0 cursor-pointer"
                >
                  <Copy className="h-3 w-3" />
                  <span>Paste</span>
                </button>
              </div>

              <button
                onClick={() => handleFetchProfile()}
                disabled={stage === "busy" || !inputVal.trim()}
                style={{
                  background:
                    "linear-gradient(135deg, #e11d48 0%, #db2777 50%, #9333ea 100%)",
                }}
                className="px-6 py-3.5 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-extrabold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98] shrink-0 cursor-pointer"
              >
                {stage === "busy" ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Fetching DP...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4" />
                    <span>Get Profile Pic</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Sample Usernames */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-[#6E6D68] dark:text-zinc-400">
            <span>Try sample:</span>
            {SAMPLE_USERS.map((sample) => (
              <button
                key={sample.username}
                onClick={() => {
                  setInputVal(sample.username);
                  handleFetchProfile(sample.username);
                }}
                className="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
              >
                <span>@{sample.username}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Stage: Busy (Loading animation) ──────────────── */}
        {stage === "busy" && (
          <div
            className="max-w-xl mx-auto p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] text-center space-y-4 shadow-sm"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            <div className="relative mx-auto h-20 w-20">
              <div
                style={{
                  background:
                    "linear-gradient(135deg, rgba(245,158,11,0.25), rgba(244,63,94,0.25), rgba(168,85,247,0.25))",
                }}
                className="absolute inset-0 rounded-full animate-pulse"
              />
              <div className="relative h-20 w-20 rounded-full border-2 border-rose-300 dark:border-rose-700 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <InstagramIcon className="h-9 w-9 animate-bounce" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#111111] dark:text-white">
                Querying Instagram Profile...
              </h3>
              <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
                Extracting high-definition avatar and profile metadata via HTML OpenGraph query...
              </p>
            </div>
            <div className="w-48 mx-auto h-1.5 bg-[#F5F4EE] dark:bg-zinc-800 rounded-full overflow-hidden">
              <div
                style={{
                  background: "linear-gradient(90deg, #f43f5e 0%, #a855f7 100%)",
                }}
                className="h-full rounded-full animate-pulse w-3/4"
              />
            </div>
          </div>
        )}

        {/* ── Stage: Error ─────────────────────────────────── */}
        {stage === "error" && (
          <div
            className="max-w-xl mx-auto p-6 rounded-2xl border border-rose-200/80 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/20 text-rose-900 dark:text-rose-300 space-y-3"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold">Profile Lookup Failed</h4>
                <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-400 leading-relaxed">
                  {errorMsg}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 pl-8">
              <button
                onClick={() => setStage("idle")}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 hover:bg-rose-200/60 transition-colors cursor-pointer"
              >
                Try Another User
              </button>
              <button
                onClick={() => {
                  setInputVal("leomessi");
                  handleFetchProfile("leomessi");
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-800 border border-rose-200 dark:border-zinc-700 text-[#111111] dark:text-white hover:bg-zinc-50 transition-colors cursor-pointer"
              >
                Test With @leomessi
              </button>
            </div>
          </div>
        )}

        {/* ── Stage: Done (Profile Picture & Actions) ───────── */}
        {stage === "done" && profileData && (
          <div
            className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] shadow-[0_8px_30px_rgba(0,0,0,0.04)] space-y-6"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            {/* Header bar */}
            <div className="flex items-center justify-between border-b border-[#EAEAE5] dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#111111] dark:text-white">
                    Profile Picture Extracted
                  </h3>
                  <p className="text-xs text-[#6E6D68] dark:text-zinc-400">
                    High definition original avatar retrieved successfully
                  </p>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#EAEAE5] dark:border-zinc-700 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-[#6E6D68] dark:text-zinc-300 transition-colors shrink-0 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Search Another</span>
              </button>
            </div>

            {/* Profile Avatar & Info Card */}
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-2">
              {/* Profile Image with Instagram Gradient Ring */}
              <div className="relative shrink-0">
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, #f59e0b 0%, #f43f5e 50%, #9333ea 100%)",
                  }}
                  className="p-1.5 rounded-full shadow-lg"
                >
                  <div className="relative h-32 w-32 sm:h-44 sm:w-44 rounded-full overflow-hidden bg-zinc-900 border-2 border-white dark:border-zinc-900">
                    <Image
                      src={profileData.profilePicUrl}
                      alt={profileData.fullName}
                      fill
                      sizes="(max-width: 640px) 128px, 176px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>

                <a
                  href={profileData.profilePicUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-1 right-1 p-2 rounded-full bg-white dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-[#111111] dark:text-white shadow-md hover:scale-110 transition-transform cursor-pointer"
                  title="View full size"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </a>
              </div>

              {/* Profile Details & Metadata */}
              <div className="flex-1 w-full text-center sm:text-left space-y-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-xl sm:text-2xl font-black text-[#111111] dark:text-white">
                      {profileData.fullName}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified HTML</span>
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-rose-600 dark:text-rose-400">
                    @{profileData.username}
                  </p>
                </div>

                {/* Follower Stats Badges */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                  {profileData.followers && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-xs">
                      <span className="font-extrabold text-[#111111] dark:text-white">
                        {profileData.followers}
                      </span>{" "}
                      <span className="text-[#6E6D68] dark:text-zinc-400 font-medium">Followers</span>
                    </div>
                  )}

                  {profileData.following && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-xs">
                      <span className="font-extrabold text-[#111111] dark:text-white">
                        {profileData.following}
                      </span>{" "}
                      <span className="text-[#6E6D68] dark:text-zinc-400 font-medium">Following</span>
                    </div>
                  )}

                  {profileData.posts && (
                    <div className="px-3 py-1.5 rounded-xl bg-[#F5F4EE] dark:bg-zinc-800 border border-[#EAEAE5] dark:border-zinc-700 text-xs">
                      <span className="font-extrabold text-[#111111] dark:text-white">
                        {profileData.posts}
                      </span>{" "}
                      <span className="text-[#6E6D68] dark:text-zinc-400 font-medium">Posts</span>
                    </div>
                  )}
                </div>

                {profileData.bio && (
                  <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed max-w-lg line-clamp-2">
                    {profileData.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-[#EAEAE5] dark:border-zinc-800">
              <button
                onClick={handleDownloadWithAd}
                className="w-full py-4 px-6 rounded-2xl bg-[#111111] hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-[#111111] text-sm font-extrabold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download Profile Picture (HD)</span>
              </button>

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  onClick={handleCopyImageUrl}
                  className="w-full sm:flex-1 py-2.5 px-4 rounded-xl border border-[#EAEAE5] dark:border-zinc-700 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-xs font-bold text-[#111111] dark:text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600 dark:text-emerald-400">
                        Image Link Copied!
                      </span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Direct Image Link</span>
                    </>
                  )}
                </button>

                <a
                  href={`https://www.instagram.com/${profileData.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl border border-[#EAEAE5] dark:border-zinc-700 hover:bg-[#F5F4EE] dark:hover:bg-zinc-800 text-xs font-semibold text-[#6E6D68] dark:text-zinc-300 transition-colors"
                >
                  <span>Open Instagram Profile</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* ── Sponsored Google Ad Slot (Auto-Collapses if Unfilled) ── */}
        {stage === "done" && (
          <div
            className="max-w-3xl mx-auto w-full"
            style={{ animation: "fade-in-up 0.3s ease-out" }}
          >
            <GoogleAd
              slot={DEFAULT_ADSENSE_SLOT}
              minHeight={120}
              label="Sponsored"
              collapseWhenUnfilled={true}
            />
          </div>
        )}

        {/* ── Feature Highlights ────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto pt-6">
          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              Instant HTML Query
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Extracts high-resolution OpenGraph avatar metadata in under 1 second without
              external app dependencies.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              Public & Private Accounts
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Works for both public and private Instagram accounts without requiring followership
              or permission.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              100% Anonymous & Secure
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Zero login required. Instagram never notifies anyone when their profile photo is
              viewed or saved.
            </p>
          </div>

          <div className="p-5 rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] space-y-2">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Download className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-[#111111] dark:text-white">
              Direct File Attachment
            </h4>
            <p className="text-xs text-[#6E6D68] dark:text-zinc-400 leading-relaxed">
              Saves the photo directly to your camera roll or downloads folder as an original JPG
              file with 1 click.
            </p>
          </div>
        </div>

        {/* ── FAQ Section ──────────────────────────────────── */}
        <div className="max-w-3xl mx-auto w-full space-y-4 pt-6">
          <div className="text-center space-y-1.5 pb-2">
            <h3 className="text-2xl font-black text-[#111111] dark:text-white">
              Frequently Asked Questions
            </h3>
            <p className="text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400">
              Everything you need to know about downloading Instagram profile photos.
            </p>
          </div>

          <div className="space-y-2">
            {FAQS.map((faq, index) => {
              const isExpanded = expandedFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#EAEAE5] dark:border-zinc-800 bg-white dark:bg-[#141417] overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedFaq(isExpanded ? null : index)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-sm text-[#111111] dark:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#9E9D98] transition-transform duration-200 shrink-0 ${
                        isExpanded ? "rotate-180 text-rose-600 dark:text-rose-400" : ""
                      }`}
                    />
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-[#6E6D68] dark:text-zinc-400 leading-relaxed border-t border-[#F5F4EE] dark:border-zinc-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Privacy Badges ───────────────────────────────── */}
        <div className="pt-6">
          <PrivacyBadges
            badges={[
              "100% In-browser preview",
              "Zero account login",
              "100% Free & Unlimited",
              "Anonymous lookup",
            ]}
          />
        </div>
      </main>

      {/* ── 3-4s Download Interstitial Modal with Google Ad ── */}
      <DownloadAdModal
        isOpen={downloadModal.isOpen}
        onClose={() => setDownloadModal((prev) => ({ ...prev, isOpen: false }))}
        downloadUrl={downloadModal.url}
        filename={downloadModal.filename}
        title={profileData?.fullName || "Instagram Profile Picture"}
        thumbnail={profileData?.profilePicUrl}
        fileType={downloadModal.fileType}
        durationSeconds={3}
      />

      <Footer />
    </div>
  );
}
