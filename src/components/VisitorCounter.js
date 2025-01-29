import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const VisitorCounter = () => {
  const [visitorInfo, setVisitorInfo] = useState({
    count: 0,
    location: '',
    ip: ''
  });

  useEffect(() => {
    const getVisitorInfo = async () => {
      try {
        // Get IP information
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipResponse.json();
        
        // Get location information
        const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await locationResponse.json();

        // Get existing visitors from localStorage
        const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
        
        setVisitorInfo({
          count: visitors.length,
          location: `${locationData.city}, ${locationData.country_name}`,
          ip: ip
        });
      } catch (error) {
        console.error('Error fetching visitor info:', error);
      }
    };

    getVisitorInfo();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed bottom-4 right-4 bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20 text-white z-50"
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm">Online Visitors: {visitorInfo.count}</span>
        </div>
        <div className="text-xs text-gray-400">
          Your Location: {visitorInfo.location}
        </div>
      </div>
    </motion.div>
  );
};

export default VisitorCounter;
