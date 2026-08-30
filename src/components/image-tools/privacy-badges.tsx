import React from "react";

export function PrivacyBadges({
  badges = [
    "100% In-browser",
    "100% Ad-Free",
    "Your files never leave your device",
    "Zero watermarks",
    "Free & unlimited",
  ],
  className = "",
}: {
  badges?: string[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {badges.map((t) => (
        <span
          key={t}
          className="rounded-full border border-[#EAEAE5] bg-white px-3 py-1 text-[11px] font-medium text-[#6E6D68]"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
