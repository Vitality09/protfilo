import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    
    // Verify current password
    if (currentPassword !== 'Badhon@0987@#') {
      setMessage({ type: 'error', text: 'Current password is incorrect' });
      return;
    }

    // Validate new password
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setMessage({ type: 'error', text: 'Password must contain at least one uppercase letter' });
      return;
    }

    if (!/[a-z]/.test(newPassword)) {
      setMessage({ type: 'error', text: 'Password must contain at least one lowercase letter' });
      return;
    }

    if (!/[0-9]/.test(newPassword)) {
      setMessage({ type: 'error', text: 'Password must contain at least one number' });
      return;
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      setMessage({ type: 'error', text: 'Password must contain at least one special character' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    // Update password in localStorage
    localStorage.setItem('adminPassword', newPassword);
    setMessage({ type: 'success', text: 'Password updated successfully' });
    
    // Clear form
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold mb-6">Settings</h3>

      <div className="max-w-md">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded ${
                message.type === 'error' 
                  ? 'bg-red-500/20 border border-red-500 text-red-500'
                  : 'bg-green-500/20 border border-green-500 text-green-500'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          <div>
            <label className="block text-gray-300 mb-2">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded hover:bg-purple-700 transition-colors duration-300"
          >
            Update Password
          </motion.button>
        </form>

        <div className="mt-6 bg-gray-700/50 p-4 rounded">
          <h4 className="font-bold mb-2">Password Requirements:</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• At least 8 characters long</li>
            <li>• At least one uppercase letter</li>
            <li>• At least one lowercase letter</li>
            <li>• At least one number</li>
            <li>• At least one special character (!@#$%^&*)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
