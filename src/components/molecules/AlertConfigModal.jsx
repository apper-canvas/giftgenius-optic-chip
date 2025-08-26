import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

const AlertConfigModal = ({ alert, globalSettings, onSave, onClose }) => {
  const [config, setConfig] = React.useState(() => {
    if (alert) {
      return {
        priceDropThreshold: alert.priceDropThreshold || 10,
        absoluteThreshold: alert.absoluteThreshold || 0,
        stockAlerts: alert.stockAlerts !== false,
        emailEnabled: alert.emailEnabled !== false,
        pushEnabled: alert.pushEnabled !== false,
        frequency: alert.frequency || 'immediate'
      };
    }
    return globalSettings;
  });

  const handleSave = () => {
    onSave(config);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md"
      >
        <Card className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {alert ? "Configure Alert" : "Notification Settings"}
              </h3>
              <p className="text-gray-600 text-sm">
                {alert ? "Set price thresholds and preferences" : "Default settings for all alerts"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>

          {alert && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Gift" size={20} className="text-purple-400" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 line-clamp-1">{alert.gift?.title}</h4>
                  <p className="text-sm text-gray-600">Current Price: ${alert.gift?.price}</p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Price Thresholds */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Price Thresholds</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Percentage Drop (%)"
                  type="number"
                  min="1"
                  max="50"
                  value={config.priceDropThreshold}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    priceDropThreshold: parseInt(e.target.value) || 0
                  }))}
                />
                
                <Input
                  label="Absolute Threshold ($)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={config.absoluteThreshold}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    absoluteThreshold: parseFloat(e.target.value) || 0
                  }))}
                />
              </div>
              
              <p className="text-xs text-gray-500">
                Alert triggers when price drops by the percentage OR absolute amount, whichever comes first.
              </p>
            </div>

            {/* Stock Alerts */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Stock Monitoring</h4>
              
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.stockAlerts}
                  onChange={(e) => setConfig(prev => ({
                    ...prev,
                    stockAlerts: e.target.checked
                  }))}
                  className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700">
                  Notify when item comes back in stock
                </span>
              </label>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Notification Methods</h4>
              
              <div className="space-y-3">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.emailEnabled}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      emailEnabled: e.target.checked
                    }))}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Mail" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">Email notifications</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.pushEnabled}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      pushEnabled: e.target.checked
                    }))}
                    className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
                  />
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Smartphone" size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">Push notifications</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Notification Frequency</h4>
              
              <select
                value={config.frequency}
                onChange={(e) => setConfig(prev => ({
                  ...prev,
                  frequency: e.target.value
                }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:border-secondary-400 focus:ring-2 focus:ring-secondary-400/20 focus:outline-none"
              >
                <option value="immediate">Immediate</option>
                <option value="daily">Daily Digest</option>
                <option value="weekly">Weekly Summary</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">
              Save Settings
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default AlertConfigModal;