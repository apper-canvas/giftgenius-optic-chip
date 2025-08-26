import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Button = React.forwardRef(
  ({ className, variant = "primary", size = "md", icon, children, disabled, ...props }, ref) => {
    const baseClasses =
      "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      primary: "bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700 focus:ring-primary-400 shadow-md hover:shadow-lg transform hover:scale-[1.02]",
      secondary: "bg-gradient-to-r from-secondary-500 to-secondary-600 text-white hover:from-secondary-600 hover:to-secondary-700 focus:ring-secondary-400 shadow-md hover:shadow-lg transform hover:scale-[1.02]",
      outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-400 hover:border-primary-600",
      ghost: "text-gray-600 hover:bg-gray-100 focus:ring-gray-400",
      accent: "bg-gradient-to-r from-accent-500 to-accent-600 text-white hover:from-accent-600 hover:to-accent-700 focus:ring-accent-400 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
    };
    
    const sizeClasses = {
      sm: "px-3 py-2 text-sm gap-2",
      md: "px-4 py-2.5 text-base gap-2",
      lg: "px-6 py-3 text-lg gap-3",
      xl: "px-8 py-4 text-xl gap-3"
    };

    return (
      <button
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled}
        ref={ref}
        {...props}
      >
        {icon && <ApperIcon name={icon} size={size === "sm" ? 16 : size === "lg" ? 20 : 18} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;