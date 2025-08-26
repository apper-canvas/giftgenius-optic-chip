import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  icon = "Gift",
  title = "No items found", 
  description = "There are no items to display at the moment.",
  action
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center min-h-[400px] space-y-6 text-center"
    >
      {/* Animated Empty Icon */}
      <motion.div
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center"
      >
        <ApperIcon name={icon} className="w-12 h-12 text-purple-400" />
      </motion.div>

      {/* Empty State Message */}
      <div className="space-y-3 max-w-md">
        <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600 leading-relaxed">{description}</p>
      </div>

      {/* Call-to-Action */}
      {action && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {action}
        </motion.div>
      )}

      {/* Decorative Elements */}
      <div className="flex space-x-2 opacity-30">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: index * 0.3
            }}
            className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Empty;