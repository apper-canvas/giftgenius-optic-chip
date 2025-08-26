import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = React.forwardRef(
  ({ className, placeholder = "Search...", onSearch, ...props }, ref) => {
    const [value, setValue] = React.useState("");

    const handleSubmit = (e) => {
      e.preventDefault();
      onSearch?.(value);
    };

    const handleChange = (e) => {
      setValue(e.target.value);
      if (e.target.value === "") {
        onSearch?.("");
      }
    };

    return (
      <form onSubmit={handleSubmit} className={cn("relative", className)}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:border-secondary-400 focus:ring-2 focus:ring-secondary-400/20 focus:outline-none transition-all duration-200 ease-out text-gray-900 placeholder-gray-500"
            {...props}
          />
        </div>
      </form>
    );
  }
);

SearchBar.displayName = "SearchBar";

export default SearchBar;