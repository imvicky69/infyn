"use client";

import React, { useId } from "react";

export type LogoVariant = "navbar" | "hero" | "loader" | "default";

export interface AnimatedLogoProps {
  /** Visual variant: 'navbar' (distinct gradient velocity), 'hero' (clean loop), 'loader' (glowing center), 'default' */
  variant?: LogoVariant;
  /** Width in px or css string (defaults: navbar=34, hero=42, loader=56, default=40) */
  width?: number | string;
  /** Optional height (defaults to aspect ratio 2:1 based on width) */
  height?: number | string;
  /** Color override (defaults to 'currentColor' or variant theme) */
  color?: string;
  /** Additional CSS classes */
  className?: string;
  /** Speed mode */
  speed?: "normal" | "fast" | "slow";
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  variant = "default",
  width,
  height,
  color,
  className = "",
  speed = "normal",
}) => {
  const uid = useId().replace(/:/g, "");
  const gradId = `infyn-logo-grad-${uid}`;
  const glowFilterId = `infyn-glow-${uid}`;

  // Smart width defaults per variant
  const resolvedWidth =
    width ?? (variant === "navbar" ? 34 : variant === "loader" ? 58 : variant === "hero" ? 42 : 40);

  // Speed durations
  const durationMap = {
    navbar: speed === "fast" ? "1.6s" : speed === "slow" ? "3.2s" : "2.4s",
    hero: speed === "fast" ? "2s" : speed === "slow" ? "4s" : "3s",
    loader: speed === "fast" ? "1.2s" : speed === "slow" ? "2.4s" : "1.8s",
    default: speed === "fast" ? "1.8s" : speed === "slow" ? "3.5s" : "2.5s",
  };
  const duration = durationMap[variant] || "2.5s";

  // Navbar variant: Distinct dual-gradient ribbon with organic velocity acceleration
  if (variant === "navbar") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 50"
        width={resolvedWidth}
        height={height}
        className={`inline-block select-none overflow-visible group/logo ${className}`}
        aria-label="Infyn navbar logo"
      >
        <defs>
          {/* Subtle vibrant emerald-to-indigo gradient for navbar identity */}
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#06B6D4" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>
          <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <style>
          {`
            @keyframes infyn-nav-orbit-${uid} {
              0% {
                stroke-dashoffset: 200;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
            .infyn-nav-track-${uid} {
              stroke: currentColor;
              opacity: 0.15;
            }
            .infyn-nav-tracer-${uid} {
              stroke: url(#${gradId});
              /* Shorter glowing beam that darts dynamically through the curves */
              stroke-dasharray: 45 155;
              stroke-dashoffset: 200;
              animation: infyn-nav-orbit-${uid} ${duration} cubic-bezier(0.4, 0, 0.2, 1) infinite;
            }
            /* Smooth acceleration and glow when parent is hovered */
            .group:hover .infyn-nav-tracer-${uid},
            .group\\/logo:hover .infyn-nav-tracer-${uid} {
              animation-duration: 1.4s;
              filter: url(#${glowFilterId});
            }
          `}
        </style>

        {/* Ambient Under-Track */}
        <path
          className={`infyn-nav-track-${uid}`}
          pathLength={200}
          d="M 50,25 C 65,5 90,5 90,25 C 90,45 65,45 50,25 C 35,5 10,5 10,25 C 10,45 35,45 50,25"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dynamic Gradient Flowing Tracer */}
        <path
          className={`infyn-nav-tracer-${uid}`}
          pathLength={200}
          d="M 50,25 C 65,5 90,5 90,25 C 90,45 65,45 50,25 C 35,5 10,5 10,25 C 10,45 35,45 50,25"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Loader variant: High-visibility glowing infinity pulse for busy / loading states
  if (variant === "loader") {
    const strokeColor = color || "#10B981"; // Vibrant emerald by default
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 50"
        width={resolvedWidth}
        height={height}
        className={`inline-block select-none overflow-visible ${className}`}
        aria-label="Loading..."
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
          <filter id={glowFilterId} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <style>
          {`
            @keyframes infyn-loader-flow-${uid} {
              0% {
                stroke-dashoffset: 200;
              }
              100% {
                stroke-dashoffset: 0;
              }
            }
            .infyn-loader-bg-${uid} {
              stroke: currentColor;
              opacity: 0.12;
            }
            .infyn-loader-beam-${uid} {
              stroke: url(#${gradId});
              stroke-dasharray: 65 135;
              stroke-dashoffset: 200;
              animation: infyn-loader-flow-${uid} ${duration} linear infinite;
              filter: url(#${glowFilterId});
            }
          `}
        </style>

        {/* Muted Track */}
        <path
          className={`infyn-loader-bg-${uid}`}
          pathLength={200}
          d="M 50,25 C 65,5 90,5 90,25 C 90,45 65,45 50,25 C 35,5 10,5 10,25 C 10,45 35,45 50,25"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Glowing Luminous Beam */}
        <path
          className={`infyn-loader-beam-${uid}`}
          pathLength={200}
          d="M 50,25 C 65,5 90,5 90,25 C 90,45 65,45 50,25 C 35,5 10,5 10,25 C 10,45 35,45 50,25"
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Hero / Default: Smooth continuous loop
  const strokeColor = color || "currentColor";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 50"
      width={resolvedWidth}
      height={height}
      className={`inline-block select-none overflow-visible ${className}`}
      aria-label="Infyn infinity logo"
    >
      <style>
        {`
          @keyframes infyn-loop-${uid} {
            0% {
              stroke-dashoffset: 200;
            }
            100% {
              stroke-dashoffset: 0;
            }
          }
          .infyn-loop-track-${uid} {
            stroke: ${strokeColor};
            opacity: 0.12;
          }
          .infyn-loop-dash-${uid} {
            stroke: ${strokeColor};
            stroke-dasharray: 60 140;
            stroke-dashoffset: 200;
            animation: infyn-loop-${uid} ${duration} linear infinite;
          }
        `}
      </style>

      {/* Background Track */}
      <path
        className={`infyn-loop-track-${uid}`}
        pathLength={200}
        d="M 50,25 C 65,5 90,5 90,25 C 90,45 65,45 50,25 C 35,5 10,5 10,25 C 10,45 35,45 50,25"
        fill="none"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Animated Flowing Line */}
      <path
        className={`infyn-loop-dash-${uid}`}
        pathLength={200}
        d="M 50,25 C 65,5 90,5 90,25 C 90,45 65,45 50,25 C 35,5 10,5 10,25 C 10,45 35,45 50,25"
        fill="none"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default AnimatedLogo;