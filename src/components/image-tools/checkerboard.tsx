import React from "react";

export function CheckerBoard({
  children,
  className = "",
  size = 16,
}: {
  children?: React.ReactNode;
  className?: string;
  size?: number;
}) {
  return (
    <div
      className={`w-full h-full flex items-center justify-center ${className}`}
      style={{
        backgroundImage: "repeating-conic-gradient(#E5E5E0 0% 25%, #F5F5F0 0% 50%)",
        backgroundSize: `${size}px ${size}px`,
      }}
    >
      {children}
    </div>
  );
}
