import { useEffect, useState } from 'react';
import { Alert, Box, Button, CircularProgress, Dialog, DialogContent, IconButton, Stack, TextField, Typography } from '@mui/material';
import { FaCalendarAlt, FaMapMarkedAlt, FaMapMarkerAlt, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { createBooking } from '../api/client';

const serviceIds = { plumber: 'plumbing', electrician: 'electrician', painter: 'painting', mason: 'masonry', carpenter: 'carpentry', gardener: 'gardening', welder: 'masonry', 'site observer': 'masonry' };

export default function BookingDialog({ worker, token, user, onClose, notify }) {
  const [form, setForm] = useState({ scheduledFor: '', address: user?.addresses?.[0]?.label || user?.address || '', description: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  useEffect(() => { setForm((current) => ({ ...current, address: user?.addresses?.[0]?.label || user?.address || current.address })); }, [user]);
  if (!worker) return null;

  const locate = () => {
    if (!navigator.geolocation) { setMessage('Location is not available in this browser. Enter the service address below.'); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const pin = `${coords.latitude.toFixed(6)}, ${coords.longitude.toFixed(6)}`;
      setForm((current) => ({ ...current, address: current.address ? `${current.address} · ${pin}` : pin }));
      setMessage('Location pin added. Add building, street, or landmark details above.');
      setLocating(false);
    }, () => { setMessage('We could not access your location. You can enter the address manually.'); setLocating(false); }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const submit = async (event) => {
    event.preventDefault(); setMessage(''); setLoading(true);
    try {
      const skill = worker.skill?.toLowerCase() || '';
      const result = await createBooking(token, {
        workerId: String(worker.id || worker._id),
        serviceId: serviceIds[skill] || worker.serviceId || 'electrician',
        scheduledFor: form.scheduledFor,
        address: form.address.trim(),
        description: form.description.trim(),
      });
      if (result.booking) notify('Request sent. You can follow its status in your account.');
      onClose();
    } catch (error) { setMessage(error.message || 'Your request could not be sent. Please try again.'); }
    finally { setLoading(false); }
  };

  const minDate = new Date(Date.now() + 60 * 60 * 1000); minDate.setMinutes(minDate.getMinutes() - minDate.getTimezoneOffset());

  return (
    <Dialog open fullWidth maxWidth="sm" onClose={() => !loading && onClose()} slotProps={{ paper: { sx: { borderRadius: 5, p: { xs: 0, sm: 1 } } } }}>
      <DialogContent sx={{ p: { xs: 3, sm: 4 } }}>
        <IconButton onClick={onClose} disabled={loading} aria-label="Close booking" sx={{ position: 'absolute', top: 13, right: 13 }}><FaTimes /></IconButton>
        <div className="eyebrow"><FaCalendarAlt /> Booking request</div>
        <Typography variant="h4" sx={{ mt: 1, mb: 1, fontWeight: 800 }}>Tell {worker.name?.split(' ')[0] || 'your professional'} what you need.</Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>This request goes to <b>{worker.name}</b>. You can track updates from your account.</Typography>
        <Box component="form" onSubmit={submit}>
          <Stack spacing={2}>
            <TextField required type="datetime-local" label="Preferred date and time" value={form.scheduledFor} onChange={(event) => setForm({ ...form, scheduledFor: event.target.value })} slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: minDate.toISOString().slice(0, 16) } }} />
            <TextField required label="Service address" placeholder="House, street, area, city" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} helperText={user?.addresses?.length ? 'Your saved address has been filled in. You can edit it for this request.' : 'Add the address where you need the service.'} />
            <Button onClick={locate} disabled={locating} startIcon={locating ? <CircularProgress size={16} /> : <FaMapMarkedAlt />} sx={{ alignSelf: 'flex-start', px: 0, color: '#287d59' }}>{locating ? 'Finding your location…' : 'Add my current location pin'}</Button>
            <TextField required multiline minRows={3} label="What needs to be done?" placeholder="Share the details that will help the professional prepare." value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} slotProps={{ htmlInput: { maxLength: 1000 } }} />
            {message && <Alert severity={message.includes('pin added') ? 'success' : 'error'} sx={{ borderRadius: 3 }}>{message}</Alert>}
            <Button disabled={loading} type="submit" variant="contained" endIcon={loading ? <CircularProgress size={17} color="inherit" /> : <FaPaperPlane />} sx={{ minHeight: 52, bgcolor: '#173d36', '&:hover': { bgcolor: '#225848' } }}>{loading ? 'Sending request…' : 'Send booking request'}</Button>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}><FaMapMarkerAlt size={12} /><Typography variant="caption">Your booking address is used only to coordinate this service.</Typography></Stack>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
