"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";

function GithubIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#EAEAE5] bg-[#FBFBFA]/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          aria-label="infyn home"
        >
          <Image
            src="/logo-clear.png"
            alt="infyn"
            width={28}
            height={28}
            className="h-7 w-auto object-contain"
            priority
          />
          <span className="font-bold text-lg tracking-tight text-[#111111]">
            infyn
          </span>
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/image"
            className="text-xs font-semibold text-[#6E6D68] hover:text-[#111111] transition-colors hidden sm:inline-block"
          >
            Image Suite
          </Link>
          <a
            href="https://github.com/imvicky69/infyn"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-[#111111] hover:bg-[#F2F1EC] transition-colors"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </header>
  );
}
