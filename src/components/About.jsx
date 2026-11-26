import { Button, Paper } from '@mui/material';
import { motion as Motion } from 'framer-motion';
import { FaArrowRight, FaCheck, FaClock, FaShieldAlt } from 'react-icons/fa';

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="section-wrap about-grid">
        <Motion.div className="about-image-wrap" initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65 }}>
          <img className="about-image" src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1100&q=88" alt="Professional home service team working together" loading="lazy" />
          <Paper className="about-note" elevation={0}><strong><FaShieldAlt style={{ marginRight: 8, color: '#29805a' }} />Choose with confidence</strong><span>Compare real service profiles and customer ratings before you book.</span></Paper>
        </Motion.div>
        <Motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.65, delay: 0.08 }}>
          <div className="eyebrow">The help you need, made simple</div>
          <h2 className="section-title">A better connection starts at home.</h2>
          <p className="section-copy">Finding the right person for a home project should feel straightforward. SkillConnect brings skilled local professionals, clear profiles, and your service requests together in one calm, convenient place.</p>
          <div className="feature-list">
            <div className="feature-row"><span className="feature-check"><FaCheck size={11} /></span><span><b>Find a good fit</b><br />Browse people by service and experience.</span></div>
            <div className="feature-row"><span className="feature-check"><FaClock size={11} /></span><span><b>Book on your schedule</b><br />Choose a time that works for your household.</span></div>
            <div className="feature-row"><span className="feature-check"><FaShieldAlt size={11} /></span><span><b>Keep requests in one place</b><br />Review your booking status from your account.</span></div>
          </div>
          <Button href="#services" endIcon={<FaArrowRight size={12} />} sx={{ mt: 3, px: 0, color: '#237450' }}>Explore our services</Button>
        </Motion.div>
      </div>
    </section>
  );
}
