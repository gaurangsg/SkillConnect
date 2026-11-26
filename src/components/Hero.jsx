import { lazy, Suspense, useState } from 'react';
import { Avatar, Box, Button, InputBase } from '@mui/material';
import { FaArrowRight, FaBolt, FaCheck, FaMapMarkerAlt, FaSearch, FaShieldAlt, FaStar } from 'react-icons/fa';
const HeroScene = lazy(() => import('./HeroScene'));

const faces = [
  'https://randomuser.me/api/portraits/women/68.jpg',
  'https://randomuser.me/api/portraits/men/32.jpg',
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=80&q=80',
];

export default function Hero({ onSearch }) {
  const [query, setQuery] = useState('');
  const search = (event) => { event.preventDefault(); onSearch(query); };

  return (
    <>
      <section id="home" className="hero-section">
        <Suspense fallback={null}><HeroScene /></Suspense>
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="hero-copy">
            <div className="hero-pill"><FaBolt size={11} /> Trusted help for your home</div>
            <h1 className="hero-title">Good work.<br /><span>Good people.</span><br />Right on time.</h1>
            <p className="hero-description">Find skilled, verified professionals for the jobs that make home feel right. Compare, connect, and book with confidence.</p>
            <form className="hero-search" onSubmit={search}>
              <FaSearch color="#75817c" style={{ margin: '0 2px 0 12px', flexShrink: 0 }} />
              <InputBase value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What do you need help with? Try plumbing" slotProps={{ input: { 'aria-label': 'Search services and workers' } }} sx={{ flex: 1, px: 1, py: 0.7, color: '#172a28' }} />
              <Button type="submit" variant="contained" endIcon={<FaArrowRight size={12} />} sx={{ px: 2.4, minWidth: 124, bgcolor: '#a5e56a', color: '#173d36', '&:hover': { bgcolor: '#b8ef86' } }}>Find help</Button>
            </form>
            <div className="hero-trust">
              <div className="avatar-stack">{faces.map((src) => <img key={src} src={src} alt="SkillConnect community member" />)}</div>
              <span><b style={{ color: '#eef8e7' }}>Local pros, real profiles</b><br />A simpler way to get it done</span>
            </div>
          </div>

          <div className="hero-visual" aria-label="A skilled tradesperson at work">
            <img className="hero-photo" src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=88" alt="Professional tradesperson at a job site" />
            <div className="hero-float-card top"><span className="float-icon"><FaShieldAlt /></span><div><div className="float-caption">A more confident choice</div><div className="float-title">Verified worker profiles</div></div></div>
            <div className="hero-float-card bottom"><span className="float-icon"><FaStar /></span><div><div className="float-caption">Customer feedback</div><div className="float-title">4.8 average partner rating</div></div></div>
          </div>
        </div>
      </section>
      <div className="stats-strip" aria-label="Marketplace benefits">
        {[
          ['8', 'Home service categories'],
          ['4.8 / 5', 'Average worker rating'],
          ['One place', 'For trusted local help'],
          ['Your time', 'Choose a convenient slot'],
        ].map(([number, label]) => <div className="stat-item" key={label}><div className="stat-number">{number}</div><div className="stat-label">{label}</div></div>)}
      </div>
    </>
  );
}
