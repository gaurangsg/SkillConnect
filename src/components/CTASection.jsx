import { Button } from '@mui/material';
import { FaArrowRight } from 'react-icons/fa';

export default function CTASection({ onStart }) {
  return <section className="cta-section"><div className="section-wrap"><div className="cta-card"><div><h2>Ready to get that project moving?</h2><p>Find the right skills. Make a plan. Get it done.</p></div><Button onClick={onStart} variant="contained" endIcon={<FaArrowRight size={12} />} sx={{ position: 'relative', zIndex: 1, minWidth: 154, minHeight: 50, bgcolor: '#b0ed7b', color: '#173d36', '&:hover': { bgcolor: '#c2f391' } }}>Get started</Button></div></div></section>;
}
