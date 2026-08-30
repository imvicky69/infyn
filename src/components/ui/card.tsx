import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", variant = "default", children, ...props }, ref) => {
    const variantStyles = {
      default: "bg-white border border-[#EAEAE5]",
      interactive:
        "bg-white border border-[#EAEAE5] hover:border-[#C8C8C0] transition-colors cursor-pointer",
    };

    return (
      <div
        ref={ref}
        className={`rounded-xl ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-5 pb-2 ${className}`} {...props} />
));
CardHeader.displayName = "CardHeader";

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className = "", ...props }, ref) => (
  <h3
    ref={ref}
    className={`text-base font-semibold tracking-tight text-[#111111] ${className}`}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className = "", ...props }, ref) => (
  <p
    ref={ref}
    className={`text-xs text-[#71716D] mt-1 leading-relaxed ${className}`}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div ref={ref} className={`p-5 pt-2 ${className}`} {...props} />
));
CardContent.displayName = "CardContent";

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`p-5 pt-0 flex items-center justify-between ${className}`}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
