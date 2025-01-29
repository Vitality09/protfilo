import React, { useState } from 'react';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString()
    };

    // Get existing messages from localStorage
    const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
    
    // Add new message
    localStorage.setItem('contactMessages', JSON.stringify([...existingMessages, newMessage]));
    
    // Reset form and show success message
    setFormData({ name: '', email: '', message: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-20 px-8 bg-black/50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto"
      >
        <h2 className="text-4xl font-bold mb-8 text-center">Get In Touch</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {success && (
            <div className="bg-green-500/20 border border-green-500 text-green-500 p-4 rounded">
              Message sent successfully!
            </div>
          )}
          <div className="bg-gray-900 rounded-xl p-8">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-gray-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="4"
                className="w-full px-4 py-2 bg-gray-800 rounded-lg h-32 resize-none focus:ring-2 focus:ring-purple-500 outline-none"
              ></textarea>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full py-3 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
            >
              Send Message
            </motion.button>
          </div>
        </form>
      </motion.div>
    </section>
  );
};

export default Contact;
