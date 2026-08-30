import * as React from "react";

export function Footer() {
  return (
    <footer className="border-t border-[#EAEAE5] py-8 text-xs text-[#71716D]">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span>© {new Date().getFullYear()} infyn. Open source.</span>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#111111] hover:underline"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
