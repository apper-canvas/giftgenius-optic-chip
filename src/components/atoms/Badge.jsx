import React from "react";
import { cn } from "@/utils/cn";

const Badge = React.forwardRef(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-full";
    
    const variantClasses = {
      default: "bg-gray-100 text-gray-800",
      primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white",
      secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white",
      accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white",
      success: "bg-gradient-to-r from-green-500 to-green-600 text-white",
      warning: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
      error: "bg-gradient-to-r from-red-500 to-red-600 text-white",
      outline: "border-2 border-gray-300 text-gray-700 bg-transparent"
    };
    
    const sizeClasses = {
      sm: "px-2 py-1 text-xs",
      md: "px-3 py-1.5 text-sm",
      lg: "px-4 py-2 text-base"
    };

    return (
      <span
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export default Badge;