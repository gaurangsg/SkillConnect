import { useState } from 'react';
import { Alert, Box, Button, Card, CardContent, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { FaArrowRight, FaKey } from 'react-icons/fa';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../api/client';

export default function PasswordResetPage({ onOpenAuth }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setMessage('');
    if (password !== confirmation) {
      setMessage('The passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const result = await resetPassword(token, password);
      setMessage(result.message);
      setComplete(true);
      setPassword('');
      setConfirmation('');
    } catch (error) {
      setMessage(error.message || 'This reset link could not be used. Request a new one and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="dashboard-page">
      <Box className="section-wrap">
        <Card sx={{ maxWidth: 560, mx: 'auto', p: { xs: 1, sm: 3 }, border: '1px solid #e6ece7', borderRadius: 5 }}>
          <CardContent>
            <Box sx={{ width: 52, height: 52, display: 'grid', placeItems: 'center', mb: 2, borderRadius: 3, color: '#287d59', bgcolor: '#e8f5e2' }}><FaKey /></Box>
            <div className="eyebrow">Account recovery</div>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 800 }}>{complete ? 'Password updated' : 'Choose a new password'}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1, mb: 3, lineHeight: 1.7 }}>
              {complete ? 'Your password has been changed. Sign in with the new one to continue.' : 'Use at least 8 characters. This one-time reset link expires after 15 minutes.'}
            </Typography>

            {message && <Alert severity={complete ? 'success' : 'error'} sx={{ mb: 2, borderRadius: 3 }}>{message}</Alert>}
            {!token ? (
              <Alert severity="warning" sx={{ borderRadius: 3 }}>This reset link is missing its token. Request a new password reset link.</Alert>
            ) : complete ? (
              <Button variant="contained" endIcon={<FaArrowRight />} onClick={() => { navigate('/'); onOpenAuth(); }}>Return to sign in</Button>
            ) : (
              <Box component="form" onSubmit={submit}>
                <Stack spacing={2}>
                  <TextField required autoFocus type="password" autoComplete="new-password" label="New password" value={password} onChange={(event) => setPassword(event.target.value)} slotProps={{ htmlInput: { minLength: 8, maxLength: 128 } }} />
                  <TextField required type="password" autoComplete="new-password" label="Confirm new password" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} slotProps={{ htmlInput: { minLength: 8, maxLength: 128 } }} />
                  <Button type="submit" disabled={loading} variant="contained" endIcon={loading ? <CircularProgress size={17} color="inherit" /> : <FaArrowRight />} sx={{ minHeight: 50 }}>{loading ? 'Updating password…' : 'Update password'}</Button>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
