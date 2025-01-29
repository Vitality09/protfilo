import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const VisitorStats = () => {
  const [visitorStats, setVisitorStats] = useState({
    totalVisitors: 0,
    uniqueVisitors24h: 0,
    recentVisitors: []
  });

  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Get visitor's IP
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipResponse.json();

        // Get location data
        const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await locationResponse.json();

        // Create visitor object
        const visitor = {
          id: Date.now(),
          ip,
          timestamp: new Date().toISOString(),
          city: locationData.city,
          region: locationData.region,
          country: locationData.country_name,
          latitude: locationData.latitude,
          longitude: locationData.longitude,
          deviceId: getOrCreateDeviceId()
        };

        // Get existing visitors
        const visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
        
        // Add new visitor
        const updatedVisitors = [...visitors, visitor];
        localStorage.setItem('visitors', JSON.stringify(updatedVisitors));

        // Calculate stats
        updateStats(updatedVisitors);
      } catch (error) {
        console.error('Error tracking visitor:', error);
      }
    };

    trackVisit();
    const interval = setInterval(updateStats, 60000); // Update stats every minute

    return () => clearInterval(interval);
  }, []);

  const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId');
    if (!deviceId) {
      deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('deviceId', deviceId);
    }
    return deviceId;
  };

  const updateStats = (visitors = null) => {
    // Get visitors if not provided
    if (!visitors) {
      visitors = JSON.parse(localStorage.getItem('visitors') || '[]');
    }

    // Get current time and 24 hours ago
    const now = new Date();
    const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

    // Get recent visitors (last 24 hours)
    const recentVisitors = visitors.filter(visitor => 
      new Date(visitor.timestamp) > twentyFourHoursAgo
    );

    // Count unique devices in last 24 hours
    const uniqueDevices = new Set(
      recentVisitors.map(visitor => visitor.deviceId)
    );

    setVisitorStats({
      totalVisitors: visitors.length,
      uniqueVisitors24h: uniqueDevices.size,
      recentVisitors: recentVisitors.slice(-10).reverse() // Last 10 visitors
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-600 p-6 rounded-lg"
        >
          <h3 className="text-lg font-medium">Total Visitors</h3>
          <p className="text-3xl font-bold mt-2">{visitorStats.totalVisitors}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-green-600 p-6 rounded-lg"
        >
          <h3 className="text-lg font-medium">Unique Visitors (24h)</h3>
          <p className="text-3xl font-bold mt-2">{visitorStats.uniqueVisitors24h}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-purple-600 p-6 rounded-lg"
        >
          <h3 className="text-lg font-medium">Recent Visitors</h3>
          <p className="text-3xl font-bold mt-2">{visitorStats.recentVisitors.length}</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-lg overflow-hidden"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Visitors</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Device ID</th>
                  <th className="pb-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {visitorStats.recentVisitors.map((visitor) => (
                  <tr key={visitor.id} className="border-b border-gray-700/50">
                    <td className="py-3">
                      {visitor.city}, {visitor.country}
                    </td>
                    <td className="py-3">
                      {visitor.deviceId.substring(0, 8)}...
                    </td>
                    <td className="py-3">
                      {new Date(visitor.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default VisitorStats;
