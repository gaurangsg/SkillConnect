import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { FaTools, FaBolt, FaWater, FaPaintRoller, FaBroom, FaSnowflake, FaHammer, FaLeaf } from 'react-icons/fa';
import { getServices } from '../api/client';

const icons = { tools: FaTools, bolt: FaBolt, water: FaWater, paint: FaPaintRoller, broom: FaBroom, snowflake: FaSnowflake, hammer: FaHammer, leaf: FaLeaf };

const ServicesSection = () => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices().then(setServices);
  }, []);

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
          {services.map((service) => {
            const Icon = icons[service.icon] || FaTools;
            return (
              <motion.div key={service.id} whileHover={{ scale: 1.05 }} className="p-6 bg-gray-100 rounded-lg shadow-lg text-center">
                <Icon size={50} className="mx-auto mb-4 text-yellow-500" />
                <h3 className="text-2xl font-semibold mb-2">{service.name}</h3>
                <p>{service.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
};

export default ServicesSection;
