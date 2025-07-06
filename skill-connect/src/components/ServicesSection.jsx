// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaTools, FaBolt, FaWater, FaPaintRoller, FaBroom, FaSnowflake, FaHammer, FaLeaf } from 'react-icons/fa';

const ServicesSection = () => {
  return (
    <section id="services" className="min-h-screen bg-white text-black py-20 px-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          <motion.div whileHover={{ scale: 1.1 }} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
            <FaTools size={50} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-semibold mb-2">Carpentry</h3>
            <p>Expert carpenters for all your furniture and fitting needs.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
            <FaBolt size={50} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-semibold mb-2">Electrician</h3>
            <p>Certified electricians for safe and quick solutions.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
            <FaWater size={50} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-semibold mb-2">Plumbing</h3>
            <p>Experienced plumbers for repairs and new installations.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
            <FaPaintRoller size={50} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-semibold mb-2">Painting</h3>
            <p>Professional painters to beautify your spaces.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
            <FaBroom size={50} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-semibold mb-2">Cleaning</h3>
            <p>Thorough home and office cleaning by skilled workers.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
            <FaSnowflake size={50} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-semibold mb-2">AC Repair</h3>
            <p>Get your air conditioning systems repaired & maintained fast.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
            <FaHammer size={50} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-semibold mb-2">Masonry</h3>
            <p>Skilled masons for all types of construction and tiling work.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
            <FaLeaf size={50} className="mx-auto mb-4 text-yellow-500" />
            <h3 className="text-2xl font-semibold mb-2">Gardening</h3>
            <p>Garden maintenance and landscaping services at your doorstep.</p>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
