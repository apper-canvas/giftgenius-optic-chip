import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const ContributorModal = ({ isOpen, onClose, onSubmit, groupGift }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    } else if (parseFloat(formData.amount) > (groupGift.targetAmount - groupGift.currentAmount)) {
      newErrors.amount = `Amount cannot exceed remaining ${(groupGift.targetAmount - groupGift.currentAmount).toFixed(2)}`;
    }

    // Check if email already exists
    const existingEmails = [
      ...groupGift.contributors.map(c => c.email),
      ...groupGift.invitedContributors.map(i => i.email)
    ];
    
    if (existingEmails.includes(formData.email)) {
      newErrors.email = 'This email has already contributed or been invited';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    onSubmit(formData);
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      amount: '',
      message: ''
    });
  };

  const remainingAmount = groupGift.targetAmount - groupGift.currentAmount;
  const progressPercentage = (groupGift.currentAmount / groupGift.targetAmount) * 100;

  const suggestedAmounts = [
    Math.min(25, remainingAmount),
    Math.min(50, remainingAmount),
    Math.min(100, remainingAmount),
    remainingAmount
  ].filter((amount, index, arr) => amount > 0 && arr.indexOf(amount) === index);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-lg"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold gradient-text">Add Contribution</h2>
              <p className="text-gray-600">Contribute to {groupGift.title}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={onClose}
            />
          </div>

          {/* Group Gift Summary */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm font-medium text-gray-900">
                  ${groupGift.currentAmount} / ${groupGift.targetAmount}
                </span>
              </div>
              
              <div className="w-full bg-white/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>{progressPercentage.toFixed(1)}% complete</span>
                <span>${remainingAmount.toFixed(2)} remaining</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name *
                </label>
                <Input
                  type="text"
                  placeholder="John Smith"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email *
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={errors.email}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contribution Amount *
              </label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                max={remainingAmount}
                placeholder="25.00"
                value={formData.amount}
                onChange={(e) => handleInputChange('amount', e.target.value)}
                error={errors.amount}
              />
              
              {/* Suggested Amounts */}
              {suggestedAmounts.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-2">Quick amounts:</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestedAmounts.map(amount => (
                      <Button
                        key={amount}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleInputChange('amount', amount.toString())}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
                rows={3}
                placeholder="Add a personal message..."
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
              />
            </div>

            {/* Current Contributors Preview */}
            {groupGift.contributors.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Current Contributors ({groupGift.contributors.length})
                </p>
                <div className="space-y-1">
                  {groupGift.contributors.slice(0, 3).map(contributor => (
                    <div key={contributor.Id} className="flex justify-between text-sm">
                      <span className="text-gray-600">{contributor.name}</span>
                      <span className="font-medium text-green-600">${contributor.amount}</span>
                    </div>
                  ))}
                  {groupGift.contributors.length > 3 && (
                    <p className="text-xs text-gray-500">
                      +{groupGift.contributors.length - 3} more contributors
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="success"
                icon="CreditCard"
              >
                Add Contribution
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default ContributorModal;