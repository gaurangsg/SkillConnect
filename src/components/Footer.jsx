import { useState } from 'react';
import { Alert, Box, Button, Container, Stack, TextField, Typography } from '@mui/material';
import { FaArrowRight, FaHammer } from 'react-icons/fa';
import { subscribeToNewsletter } from '../api/client';
import { supportPhone } from '../data/contact';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const subscribe = async (event) => {
    event.preventDefault(); setLoading(true); setMessage('');
    try { await subscribeToNewsletter(email); setEmail(''); setMessage('You are on the list. Thank you!'); }
    catch (error) { setMessage(error.message || 'Could not subscribe right now. Please try again.'); }
    finally { setLoading(false); }
  };

  return (
    <footer id="contact" className="footer">
      <Container maxWidth="lg">
        <div className="footer-grid">
          <div><div className="nav-brand" style={{ color: '#fff' }}><span className="nav-mark" style={{ background: '#a5e56a', color: '#173d36' }}><FaHammer size={15} /></span><span>skill<span style={{ color: '#a5e56a' }}>connect</span></span></div><Typography sx={{ mt: 2, maxWidth: 280, color: '#b8c7be', fontSize: 13, lineHeight: 1.8 }}>Bringing people and skilled professionals together, one well-done project at a time.</Typography></div>
          <div><h4 className="footer-title">Explore</h4><a className="footer-link" href="#services">Services</a><a className="footer-link" href="#workers">Professionals</a><a className="footer-link" href="#how-it-works">How it works</a></div>
          <div><h4 className="footer-title">SkillConnect</h4><a className="footer-link" href="#about">About us</a><a className="footer-link" href="#reviews">Customer stories</a><a className="footer-link" href={`tel:${supportPhone}`}>Call support</a></div>
          <div><h4 className="footer-title">Occasional good news</h4><Typography sx={{ mb: 1.5, color: '#b8c7be', fontSize: 13 }}>Helpful home tips and platform updates. No clutter.</Typography><Box component="form" onSubmit={subscribe}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}><TextField type="email" required size="small" placeholder="Your email address" value={email} onChange={(event) => setEmail(event.target.value)} slotProps={{ htmlInput: { 'aria-label': 'Your email address' } }} sx={{ flex: 1, '& .MuiOutlinedInput-root': { bgcolor: '#f8fcf8', borderRadius: 99 } }} /><Button disabled={loading} type="submit" variant="contained" endIcon={<FaArrowRight size={11} />} sx={{ bgcolor: '#a5e56a', color: '#173d36', '&:hover': { bgcolor: '#b8ef86' } }}>Join</Button></Stack>
          </Box>{message && <Alert severity={message.includes('Thank') ? 'success' : 'error'} sx={{ mt: 1.5, borderRadius: 3 }}>{message}</Alert>}</div>
        </div>
        <div className="footer-bottom"><span>© {new Date().getFullYear()} SkillConnect. Built for better everyday work.</span><span>Made to make finding help feel easier.</span></div>
      </Container>
    </footer>
  );
}
