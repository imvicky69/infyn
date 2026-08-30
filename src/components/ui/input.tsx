import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className = "",
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label className="block text-xs font-medium text-[#111111]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-[#71716D]">
              {leftIcon}
            </div>
          )}
          <input
            type={type}
            ref={ref}
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-[#111111] placeholder-[#9E9D98] transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#111111] disabled:cursor-not-allowed disabled:opacity-60 ${
              leftIcon ? "pl-9" : ""
            } ${rightIcon ? "pr-9" : ""} ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-[#EAEAE5] hover:border-[#D0D0C8] focus:border-[#111111]"
            } ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-[#71716D]">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#71716D]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", label, helperText, error, rows = 4, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5 font-sans">
        {label && (
          <label className="block text-xs font-medium text-[#111111]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          rows={rows}
          className={`w-full rounded-lg border bg-white p-3 text-sm text-[#111111] placeholder-[#9E9D98] transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-[#111111] disabled:cursor-not-allowed disabled:opacity-60 ${
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-[#EAEAE5] hover:border-[#D0D0C8] focus:border-[#111111]"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#71716D]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
