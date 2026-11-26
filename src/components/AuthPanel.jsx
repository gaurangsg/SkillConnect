import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogContent, IconButton, MenuItem, Stack, TextField, Typography } from '@mui/material';
import { FaArrowRight, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { loginUser, registerUser, requestPasswordReset } from '../api/client';

const initialForm = { name: '', email: '', password: '', role: 'customer' };

export default function AuthPanel({ open, onClose, onAuthenticated }) {
  const [registering, setRegistering] = useState(false);
  const [recovering, setRecovering] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [messageSeverity, setMessageSeverity] = useState('error');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);

  const close = () => {
    if (loading) return;
    setMessage('');
    setResetToken('');
    setRecovering(false);
    onClose();
  };
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    setResetToken('');
    try {
      if (recovering) {
        const result = await requestPasswordReset(form.email);
        setMessage(result.message);
        setMessageSeverity('success');
        setResetToken(result.resetToken || '');
        return;
      }
      const result = registering ? await registerUser(form) : await loginUser({ email: form.email, password: form.password });
      onAuthenticated(result);
      setForm(initialForm);
      setRegistering(false);
      setRecovering(false);
    } catch (error) {
      setMessage(error.message || 'We could not sign you in. Please try again.');
      setMessageSeverity('error');
    } finally { setLoading(false); }
  };

  const switchMode = (mode) => {
    setRegistering(mode === 'register');
    setRecovering(mode === 'recover');
    setMessage('');
    setResetToken('');
    setForm((current) => ({ ...current, password: '' }));
  };

  const resetLink = resetToken ? `/reset-password?token=${encodeURIComponent(resetToken)}` : '';
  const heading = recovering ? 'Reset your password' : registering ? 'Create your account' : 'Sign in to SkillConnect';
  const eyebrow = recovering ? 'Account recovery' : registering ? 'Join the community' : 'Welcome back';

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="md" slotProps={{ paper: { sx: { overflow: 'hidden', borderRadius: { xs: 4, sm: 6 }, boxShadow: '0 30px 100px #102a2535' } } }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '0.85fr 1fr' }, minHeight: { md: 580 } }}>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, position: 'relative', flexDirection: 'column', justifyContent: 'space-between', p: 4, color: 'white', background: 'linear-gradient(155deg,#173d36,#102a25)' }}>
          <Box sx={{ position: 'absolute', width: 430, height: 430, left: -130, bottom: -200, border: '1px solid #ffffff22', borderRadius: '50%', boxShadow: '0 0 0 40px #ffffff08,0 0 0 80px #ffffff05' }} />
          <Typography sx={{ position: 'relative', fontWeight: 800, fontFamily: 'Manrope,sans-serif', fontSize: 18 }}>skill<span style={{ color: '#a5e56a' }}>connect</span></Typography>
          <Box sx={{ position: 'relative' }}>
            <Typography variant="h3" sx={{ color: 'white', mb: 2 }}>Make the next<br />home project easy.</Typography>
            <Typography sx={{ color: '#c5d5cb', lineHeight: 1.8 }}>Find local skilled workers, share what you need, and follow every booking from one place.</Typography>
            <Stack spacing={1.5} sx={{ mt: 3 }}>{['One account for every booking', 'Clear status updates', 'Your details stay in your account'].map((text) => <Stack direction="row" spacing={1.3} key={text} sx={{ alignItems: 'center' }}><FaCheckCircle color="#a5e56a" /><Typography variant="body2" color="#eff6f0">{text}</Typography></Stack>)}</Stack>
          </Box>
          <Typography variant="caption" sx={{ position: 'relative', color: '#a9bbb0' }}>A better way to find good people.</Typography>
        </Box>
        <DialogContent sx={{ p: { xs: 3, sm: 5 }, position: 'relative' }}>
          <IconButton onClick={close} aria-label="Close" sx={{ position: 'absolute', top: 14, right: 14, color: '#63736c' }}><FaTimes /></IconButton>
          <Typography className="eyebrow">{eyebrow}</Typography>
          <Typography variant="h4" sx={{ mt: 1.3, fontWeight: 800 }}>{heading}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, mb: 3.5, lineHeight: 1.7 }}>
            {recovering
              ? 'Enter your account email. A one-time development reset link will appear here while email delivery is being set up.'
              : registering
                ? 'Choose the account that fits how you want to use SkillConnect.'
                : 'Your bookings and trusted professionals are right where you left them.'}
          </Typography>
          <Box component="form" onSubmit={submit}>
            <Stack spacing={2}>
              {registering && <TextField required autoComplete="name" label="Full name" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} slotProps={{ htmlInput: { minLength: 2 } }} />}
              {registering && <TextField select label="I am here to…" value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value })}><MenuItem value="customer">Find a skilled professional</MenuItem><MenuItem value="worker">Offer skilled services</MenuItem></TextField>}
              <TextField required autoComplete="email" type="email" label="Email address" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
              {!recovering && <TextField required autoComplete={registering ? 'new-password' : 'current-password'} type="password" label={registering ? 'Password (8+ characters)' : 'Password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} slotProps={{ htmlInput: { minLength: 8, maxLength: 128 } }} />}
              {message && <Alert severity={messageSeverity} sx={{ borderRadius: 3 }}>{message}</Alert>}
              {resetLink && <Button component={Link} to={resetLink} onClick={close} variant="outlined" sx={{ borderRadius: 3 }}>Open development reset link</Button>}
              <Button type="submit" disabled={loading} variant="contained" endIcon={loading ? <CircularProgress size={17} color="inherit" /> : <FaArrowRight size={13} />} sx={{ mt: 1, minHeight: 52, bgcolor: '#173d36', '&:hover': { bgcolor: '#225848' } }}>{loading ? 'Please wait…' : recovering ? 'Create reset link' : registering ? 'Create account' : 'Sign in securely'}</Button>
            </Stack>
          </Box>
          {recovering ? (
            <Button fullWidth onClick={() => switchMode('login')} sx={{ mt: 2, color: '#397657' }}>Back to sign in</Button>
          ) : (
            <>
              <Button fullWidth onClick={() => switchMode(registering ? 'login' : 'register')} sx={{ mt: 2, color: '#397657' }}>{registering ? 'Already have an account? Sign in' : 'New here? Create an account'}</Button>
              {!registering && <Button fullWidth onClick={() => switchMode('recover')} sx={{ mt: 0.5, color: '#397657' }}>Forgot password?</Button>}
              <Typography variant="caption" display="block" align="center" color="text.secondary" sx={{ mt: 1 }}>Your password is encrypted before it is stored.</Typography>
            </>
          )}
        </DialogContent>
      </Box>
    </Dialog>
  );
}
