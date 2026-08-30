import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
    | "default"
    | "butter"
    | "ice"
    | "sky"
    | "steel"
    | "outline"
    | "success";
  size?: "sm" | "md";
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className = "", variant = "default", size = "md", children, ...props }, ref) => {
    const variantStyles = {
      default:
        "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700",
      butter:
        "bg-[#F9E8A2]/80 text-amber-950 border border-[#F9E8A2] dark:bg-[#F9E8A2]/20 dark:text-amber-300 dark:border-[#F9E8A2]/40",
      ice:
        "bg-[#B4E1EB]/80 text-cyan-950 border border-[#B4E1EB] dark:bg-[#B4E1EB]/20 dark:text-cyan-300 dark:border-[#B4E1EB]/40",
      sky:
        "bg-[#95BDD7]/80 text-slate-950 border border-[#95BDD7] dark:bg-[#95BDD7]/20 dark:text-sky-200 dark:border-[#95BDD7]/40",
      steel:
        "bg-[#78A4CB] text-white border border-[#78A4CB] shadow-sm",
      outline:
        "border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-transparent",
      success:
        "bg-emerald-100 text-emerald-800 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
    };

    const sizeStyles = {
      sm: "text-[10px] px-2 py-0.5 font-medium",
      md: "text-xs px-2.5 py-1 font-semibold",
    };

    return (
      <span
        ref={ref}
        className={`inline-flex items-center gap-1 rounded-full font-sans tracking-wide ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";
