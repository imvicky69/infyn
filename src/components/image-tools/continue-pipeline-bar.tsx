"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { setPipelineImage } from "@/components/image-tools/pipeline-storage";

export type ToolId = "bg-remover" | "compressor" | "resizer" | "converter" | "heic-to-jpg" | "exif-remover";

interface PipelineOption {
  id: ToolId;
  label: string;
  href: string;
  icon: React.ReactNode;
}

const ALL_PIPELINE_TOOLS: PipelineOption[] = [
  {
    id: "bg-remover",
    label: "Remove Background",
    href: "/image/bg-remover",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
      </svg>
    ),
  },
  {
    id: "compressor",
    label: "Compress",
    href: "/image/compressor",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0 0h4.5m-4.5 0L9 3.75M20.25 3.75h-4.5m0 0v4.5m0-4.5L15 9m5.25 11.25v-4.5m0 0h-4.5m4.5 0L15 20.25M3.75 20.25h4.5m0 0v-4.5m0 4.5L9 15" />
      </svg>
    ),
  },
  {
    id: "resizer",
    label: "Resize",
    href: "/image/resizer",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M9 9h6v6H9V9z" />
      </svg>
    ),
  },
  {
    id: "converter",
    label: "Convert",
    href: "/image/converter",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  {
    id: "exif-remover",
    label: "Remove Metadata",
    href: "/image/exif-remover",
    icon: (
      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </svg>
    ),
  },
];

interface ContinuePipelineBarProps {
  currentTool: ToolId;
  getImageBlob: () => Promise<Blob | File | null> | (Blob | File | null);
  imageName?: string;
  className?: string;
  variant?: "card" | "inline";
}

export function ContinuePipelineBar({
  currentTool,
  getImageBlob,
  imageName = "image.png",
  className = "",
  variant = "card",
}: ContinuePipelineBarProps) {
  const router = useRouter();
  const [navigatingTo, setNavigatingTo] = useState<string | null>(null);

  const availableTools = ALL_PIPELINE_TOOLS.filter((t) => t.id !== currentTool);

  const handleSelectTool = async (tool: PipelineOption) => {
    try {
      setNavigatingTo(tool.id);
      const fileOrBlob = await getImageBlob();
      if (!fileOrBlob) {
        setNavigatingTo(null);
        return;
      }

      await setPipelineImage(fileOrBlob, imageName);
      router.push(tool.href);
    } catch (err) {
      console.error("Failed to transition image to next tool", err);
      setNavigatingTo(null);
    }
  };

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-1.5 flex-wrap ${className}`}>
        <span className="text-[11px] font-semibold text-[#9E9D98] mr-1">Continue in:</span>
        {availableTools.map((tool) => {
          const isLoading = navigatingTo === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => handleSelectTool(tool)}
              disabled={navigatingTo !== null}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#F5F4EE] hover:bg-[#EAEAE5] border border-[#EAEAE5] text-[11px] font-semibold text-[#111111] hover:border-[#BEBDB9] active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-3 w-3 rounded-full border-2 border-[#111111] border-t-transparent animate-spin" />
              ) : (
                tool.icon
              )}
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-[#EAEAE5] bg-white p-4 space-y-3 shadow-2xs ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-[#111111]">
          <svg className="h-3.5 w-3.5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
          <span>Continue editing with this image</span>
        </div>
        <span className="text-[10px] font-semibold text-[#9E9D98]">Upload once • Transform anywhere</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1">
        {availableTools.map((tool) => {
          const isLoading = navigatingTo === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => handleSelectTool(tool)}
              disabled={navigatingTo !== null}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F4EE] hover:bg-[#EAEAE5] border border-[#EAEAE5] text-xs font-semibold text-[#111111] hover:border-[#BEBDB9] active:scale-98 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <div className="h-3.5 w-3.5 rounded-full border-2 border-[#111111] border-t-transparent animate-spin" />
              ) : (
                tool.icon
              )}
              <span>{tool.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
