import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const FilterPanel = ({ className, filters, onFiltersChange, onReset }) => {
  const categories = ["Products", "Experiences", "DIY"];
  
  const handleCategoryToggle = (category) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handlePriceChange = (field, value) => {
    onFiltersChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [field]: parseInt(value) || 0
      }
    });
  };

  const handleDeliveryChange = (value) => {
    onFiltersChange({
      ...filters,
      maxDeliveryDays: parseInt(value) || 30
    });
  };

  return (
    <Card className={cn("space-y-6", className)} variant="compact">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button variant="ghost" size="sm" onClick={onReset}>
          <ApperIcon name="RotateCcw" size={16} />
          Reset
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-400"
              />
              <span className="text-sm text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Price Range</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-gray-600 mb-1">Min ($)</label>
            <input
              type="number"
              value={filters.priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              placeholder="0"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-secondary-400 focus:ring-1 focus:ring-secondary-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600 mb-1">Max ($)</label>
            <input
              type="number"
              value={filters.priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              placeholder="1000"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-secondary-400 focus:ring-1 focus:ring-secondary-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Delivery Time */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Max Delivery Time</h4>
        <div className="space-y-2">
          <input
            type="range"
            min="1"
            max="30"
            value={filters.maxDeliveryDays}
            onChange={(e) => handleDeliveryChange(e.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-primary"
          />
          <div className="flex justify-between text-xs text-gray-600">
            <span>1 day</span>
            <span className="font-medium text-secondary-600">{filters.maxDeliveryDays} days</span>
            <span>30 days</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default FilterPanel;