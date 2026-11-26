import { useEffect, useState } from 'react';
import { Button, Paper } from '@mui/material';
import { motion as Motion } from 'framer-motion';
import { FaArrowRight, FaBolt, FaBroom, FaHammer, FaLeaf, FaPaintRoller, FaSnowflake, FaTools, FaWater } from 'react-icons/fa';
import { getServices } from '../api/client';

const icons = { tools: FaTools, bolt: FaBolt, water: FaWater, paint: FaPaintRoller, broom: FaBroom, snowflake: FaSnowflake, hammer: FaHammer, leaf: FaLeaf };

export default function ServicesSection({ selectedService, onSelect }) {
  const [services, setServices] = useState([]);
  useEffect(() => { let active = true; getServices().then((result) => { if (active) setServices(result); }); return () => { active = false; }; }, []);

  const select = (serviceId) => {
    onSelect(selectedService === serviceId ? '' : serviceId);
    requestAnimationFrame(() => document.getElementById('workers')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  return (
    <section id="services" className="section-pad service-section">
      <div className="section-wrap">
        <div className="section-heading-row">
          <div><div className="eyebrow">One trusted place to start</div><h2 className="section-title">What can we help with?</h2><p className="section-copy">From the small fixes to the bigger plans, find someone with the right skills for your next project.</p></div>
          <Button href="#workers" endIcon={<FaArrowRight size={12} />} sx={{ color: '#237450', flexShrink: 0 }}>See all professionals</Button>
        </div>
        <div className="service-grid">
          {services.map((service, index) => {
            const Icon = icons[service.icon] || FaTools;
            return <Motion.div key={service.id || service._id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.035 }}>
              <Paper component="button" type="button" elevation={0} className={`service-card ${selectedService === service.id ? 'selected' : ''}`} onClick={() => select(service.id)} aria-pressed={selectedService === service.id} sx={{ width: '100%', textAlign: 'left', cursor: 'pointer' }}>
                <span className="service-icon"><Icon /></span><div className="service-name">{service.name}</div><div className="service-description">{service.description}</div>
              </Paper>
            </Motion.div>;
          })}
        </div>
      </div>
    </section>
  );
}
