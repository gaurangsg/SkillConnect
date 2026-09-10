// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { useState } from 'react';
import { subscribeToNewsletter } from '../api/client';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const subscribe = async (event) => {
    event.preventDefault();
    try {
      await subscribeToNewsletter(email);
      setEmail('');
      setMessage('Subscribed successfully.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <motion.footer

      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 2.5, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-black text-white py-16" 
    >
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
        
        <div>
          <h3 className="text-2xl font-bold mb-4 text-cyan-400">SKILL - CONNECT </h3>
          <p className="text-white">Reliable and verified workers at your service, anytime, anywhere.</p>
        </div>

        <div>
        <h4 className="text-lg font-semibold mb-3 border-b border-yellow-500 pb-1">COMPANY</h4>

          <ul className="space-y-2 text-gray-300">
            <li><a href="#services" className="hover:text-yellow-400 transition-all duration-300">SERVICES</a></li>
            <li><a href="#pricing" className="hover:text-yellow-400 transition-all duration-300">PRICING</a></li>
            <li><a href="#about" className="hover:text-yellow-400 transition-all duration-300">ABOUT US!</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-3 border-b border-yellow-500 pb-1">Follow Us</h4>
          <ul className="space-y-2 text-gray-300">
            <li><a href="#" className="hover:text-yellow-400 transition-all duration-300">Instagram</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-all duration-300">Facebook</a></li>
            <li><a href="#" className="hover:text-yellow-400 transition-all duration-300">LinkedIn</a></li>
          </ul>
        </div>


        <div>
          <h4 className="text-lg font-semibold mb-3 border-b border-yellow-500 pb-1">Newsletter</h4>
          <form onSubmit={subscribe}>
            <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full p-3 rounded-md bg-white text-black mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button type="submit" className="w-full py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition-all duration-300">
              Subscribe
            </button>
          </form>
          {message && <p className="text-sm text-gray-300 mt-2">{message}</p>}
        </div>
      </div>

      <div className="text-center text-gray-500 mt-10 text-sm">
        &copy; 2025 SkillConnect. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
