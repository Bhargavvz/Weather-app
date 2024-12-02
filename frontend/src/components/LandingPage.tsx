import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSun, FiCloud, FiCloudRain, FiMapPin, FiTrendingUp, FiClock } from 'react-icons/fi';

const LandingPage: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Real-time Updates",
      description: "Stay informed with accurate, up-to-the-minute weather data for any location."
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Historical Trends",
      description: "Analyze weather patterns and track changes over time with detailed analytics."
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Multiple Locations",
      description: "Track weather conditions for all your favorite locations in one place."
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/30 to-purple-500/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -360],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-purple-500/30 to-pink-500/30 rounded-full blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl w-full text-center"
        >
          <motion.div variants={itemVariants} className="space-y-6 mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
              Your Personal
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-pink-200">
                Weather Companion
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get real-time weather updates, historical trends, and personalized forecasts for any location worldwide.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-white/40 transition-colors"
              >
                <div className="text-white mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-blue-100">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-200 shadow-lg hover:shadow-xl"
              >
                Get Started
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition duration-200"
              >
                Login
                <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </motion.div>
          </motion.div>

          {/* Weather icons animation */}
          <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
            <motion.div
              animate={{
                x: [-100, window.innerWidth],
                y: [-20, 20, -20]
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                },
                y: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }
              }}
              className="flex gap-8 text-white/20"
            >
              <FiSun className="w-8 h-8" />
              <FiCloud className="w-8 h-8" />
              <FiCloudRain className="w-8 h-8" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
