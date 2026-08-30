import React from "react";

export function ProgressBar({
  value,
  text,
  className = "",
}: {
  value: number;
  text: string;
  className?: string;
}) {
  return (
    <div className={`w-full max-w-sm mx-auto flex flex-col gap-3 ${className}`}>
      <div className="relative h-1.5 w-full rounded-full bg-[#EAEAE5] overflow-hidden">
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(200,200,200,0.4) 50%, transparent 100%)",
            backgroundSize: "200% 100%",
            animation: "shimmer-sweep 2s linear infinite",
          }}
        />
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-[#111111] transition-[width] duration-500 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[#9E9D98]">
        <span
          key={text}
          className="transition-all duration-300"
          style={{ animation: "fade-in-up 0.3s ease-out" }}
        >
          {text}
        </span>
        <span className="font-semibold tabular-nums text-[#111111]">{value}%</span>
      </div>
    </div>
  );
}
