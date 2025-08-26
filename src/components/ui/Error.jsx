import React from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ 
  message = "Something went wrong", 
  description = "We encountered an error while loading your data. Please try again.",
  onRetry,
  showRetry = true 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center"
    >
      {/* Error Icon */}
      <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
        <ApperIcon name="AlertCircle" className="w-10 h-10 text-red-500" />
      </div>

      {/* Error Message */}
      <div className="space-y-2 max-w-md">
        <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
        <p className="text-gray-600">{description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {showRetry && onRetry && (
          <Button variant="primary" onClick={onRetry} icon="RefreshCw">
            Try Again
          </Button>
        )}
        <Button 
          variant="outline" 
          onClick={() => window.location.reload()}
          icon="RotateCcw"
        >
          Refresh Page
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-sm text-gray-500 max-w-lg">
        <p>If the problem persists, please check your internet connection or contact support.</p>
      </div>
    </motion.div>
  );
};

export default Error;