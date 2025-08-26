import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Avatar = React.forwardRef(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-8 h-8 text-sm",
      md: "w-12 h-12 text-lg",
      lg: "w-16 h-16 text-xl",
      xl: "w-24 h-24 text-2xl",
      "2xl": "w-32 h-32 text-3xl"
    };

    const baseClasses = "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 text-white font-medium overflow-hidden";

    if (src) {
      return (
        <div
          className={cn(baseClasses, sizeClasses[size], className)}
          ref={ref}
          {...props}
        >
          <img
            src={src}
            alt={alt || "Avatar"}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    return (
      <div
        className={cn(baseClasses, sizeClasses[size], className)}
        ref={ref}
        {...props}
      >
        {fallback ? (
          fallback
        ) : (
          <ApperIcon name="User" size={size === "sm" ? 16 : size === "md" ? 20 : size === "lg" ? 24 : 32} />
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export default Avatar;