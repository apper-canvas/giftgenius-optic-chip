import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading gifts..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      {/* Animated Gift Icon */}
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 0.9, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center shadow-lg"
      >
        <ApperIcon name="Gift" className="w-10 h-10 text-white" />
      </motion.div>

      {/* Loading Message */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold text-gray-900">{message}</h3>
        <p className="text-gray-600">Our AI is finding the perfect matches...</p>
      </div>

      {/* Loading Dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2
            }}
            className="w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
          />
        ))}
      </div>

      {/* Skeleton Cards */}
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index} className="bg-white rounded-card shadow-card p-6 space-y-4">
            {/* Image Skeleton */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg shimmer" />
            
            {/* Title Skeleton */}
            <div className="space-y-2">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-2/3" />
            </div>
            
            {/* Price and Details */}
            <div className="flex justify-between items-center">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-20" />
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-16" />
            </div>
            
            {/* Reasoning Box */}
            <div className="bg-gray-100 rounded-lg p-3 space-y-2">
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer w-4/5" />
            </div>
            
            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer" />
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;