import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundManager } from '../utils/soundManager';

const StartupPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    soundManager.play('startup');
    
    const timer = setTimeout(() => {
      setIsLoading(false);
      soundManager.play('loaded');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleNext = () => {
    soundManager.play('button_click');
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    soundManager.play('button_click');
    setStep(prev => prev - 1);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-[#7FB3D5] to-[#AED6F1]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto mb-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border-4 border-white rounded-full border-t-transparent"
            />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">MoodRing</h1>
          <p className="text-white/80">Loading your experience...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7FB3D5] to-[#AED6F1] p-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-2xl mx-auto bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-8"
        >
          {step === 0 && (
            <div className="text-center">
              <h1 className="text-4xl font-bold text-[#2C3E50] mb-6">Welcome to MoodRing</h1>
              <p className="text-lg text-gray-600 mb-8">
                Your new social space for sharing moments and connecting with friends.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="px-8 py-3 bg-[#7FB3D5] text-white rounded-full text-lg font-medium hover:bg-[#6A9FC0] transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Create Your Account</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
                    placeholder="Choose a username"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
                    placeholder="Create a password"
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="px-8 py-3 bg-[#7FB3D5] text-white rounded-full text-lg font-medium hover:bg-[#6A9FC0] transition-colors"
                  >
                    Continue
                  </motion.button>
                </div>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-6">Customize Your Profile</h2>
              <div className="space-y-6">
                <div className="flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors">
                    <span className="text-gray-500">Add Photo</span>
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Bio</label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7FB3D5]"
                    rows={3}
                    placeholder="Tell us about yourself"
                  />
                </div>
                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleNext}
                    className="px-8 py-3 bg-[#7FB3D5] text-white rounded-full text-lg font-medium hover:bg-[#6A9FC0] transition-colors"
                  >
                    Complete Setup
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
                className="w-24 h-24 mx-auto mb-6 bg-[#7FB3D5] rounded-full flex items-center justify-center"
              >
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h2 className="text-2xl font-bold text-[#2C3E50] mb-4">All Set!</h2>
              <p className="text-gray-600 mb-8">
                Your account has been created successfully. Welcome to MoodRing!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/feed'}
                className="px-8 py-3 bg-[#7FB3D5] text-white rounded-full text-lg font-medium hover:bg-[#6A9FC0] transition-colors"
              >
                Enter MoodRing
              </motion.button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default StartupPage; 