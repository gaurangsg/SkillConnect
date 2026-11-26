import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { FaArrowLeft, FaCalendarAlt, FaCheck, FaClock, FaHammer, FaMapMarkerAlt, FaSearch, FaSyncAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getBookings, updateBookingStatus } from '../api/client';

const dateLabel = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? 'Date to be confirmed'
    : date.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
};

const statusColor = {
  pending: 'warning',
  confirmed: 'info',
  completed: 'success',
  cancelled: 'default',
};

export default function DashboardPage({ session, onOpenAuth, notify }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(Boolean(session.token));
  const [error, setError] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const role = session.user?.role || 'customer';
  const isWorker = role === 'worker';
  const title = role === 'worker' ? 'Your assigned jobs' : role === 'admin' ? 'Marketplace operations' : 'Your bookings';

  useEffect(() => {
    if (!session.token) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    setError('');
    getBookings(session.token)
      .then((items) => { if (active) setBookings(items); })
      .catch((reason) => { if (active) setError(reason.message || 'Bookings could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [session.token, refreshKey]);

  const stats = useMemo(() => ({
    total: bookings.length,
    active: bookings.filter((booking) => ['pending', 'confirmed'].includes(booking.status)).length,
    completed: bookings.filter((booking) => booking.status === 'completed').length,
  }), [bookings]);

  const filteredBookings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesFilter = activeFilter === 'all'
        || (activeFilter === 'active' && ['pending', 'confirmed'].includes(booking.status))
        || booking.status === activeFilter;
      const matchesSearch = !query || [
        booking.serviceName,
        booking.serviceId,
        booking.workerName,
        booking.customerId?.name,
        booking.address,
        booking.description,
      ].some((value) => String(value || '').toLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, bookings, searchTerm]);

  const changeStatus = async (booking, status) => {
    setUpdatingId(booking._id);
    setError('');
    try {
      const result = await updateBookingStatus(session.token, booking._id, status);
      setBookings((current) => current.map((item) => item._id === booking._id
        ? { ...item, ...result.booking, serviceName: item.serviceName, workerName: item.workerName }
        : item));
      notify(`Booking ${status}.`);
    } catch (reason) {
      setError(reason.message || 'The booking could not be updated.');
    } finally {
      setUpdatingId('');
    }
  };

  const actionsFor = (booking) => {
    if (booking.status === 'pending') {
      return (
        <>
          {(isWorker || role === 'admin') && <Button size="small" variant="contained" onClick={() => changeStatus(booking, 'confirmed')}>Confirm</Button>}
          {!isWorker && role !== 'admin' && <Button size="small" color="error" onClick={() => changeStatus(booking, 'cancelled')}>Cancel request</Button>}
          {role === 'admin' && <Button size="small" color="error" onClick={() => changeStatus(booking, 'cancelled')}>Cancel</Button>}
        </>
      );
    }
    if (booking.status === 'confirmed') {
      return (
        <>
          {(isWorker || role === 'admin') && <Button size="small" variant="contained" onClick={() => changeStatus(booking, 'completed')}>Mark complete</Button>}
          {!isWorker && role !== 'admin' && <Button size="small" color="error" onClick={() => changeStatus(booking, 'cancelled')}>Cancel booking</Button>}
          {role === 'admin' && <Button size="small" color="error" onClick={() => changeStatus(booking, 'cancelled')}>Cancel</Button>}
        </>
      );
    }
    return null;
  };

  if (!session.token) {
    return (
      <Box className="dashboard-page">
        <Box className="section-wrap">
          <Card sx={{ maxWidth: 620, mx: 'auto', p: { xs: 2, sm: 4 }, textAlign: 'center', borderRadius: 5 }}>
            <CardContent>
              <Avatar sx={{ width: 58, height: 58, mx: 'auto', mb: 2, bgcolor: '#e8f5e2', color: '#287d59' }}><FaHammer /></Avatar>
              <Typography variant="h4" sx={{ fontWeight: 800 }}>Sign in to view your account</Typography>
              <Typography color="text.secondary" sx={{ my: 2 }}>Your requests, job updates, and booking details are available in one place.</Typography>
              <Button variant="contained" onClick={onOpenAuth}>Sign in or create an account</Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }

  return (
    <Box className="dashboard-page">
      <Box className="section-wrap">
        <Button component={Link} to="/" startIcon={<FaArrowLeft />} sx={{ mb: 3, color: '#287d59' }}>Back to marketplace</Button>
        <Box className="dashboard-hero">
          <Box className="dashboard-hero-copy">
            <div className="dashboard-eyebrow">{role === 'admin' ? 'Admin workspace' : isWorker ? 'Professional workspace' : 'Your SkillConnect account'}</div>
            <Typography variant="h2" sx={{ mt: 1.2, color: '#fff', fontWeight: 800, letterSpacing: '-.055em' }}>{title}</Typography>
            <Typography sx={{ mt: 1.2, maxWidth: 570, color: '#e1ebe4', lineHeight: 1.7 }}>
              Welcome{session.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}. Keep track of your projects, updates, and next steps in one place.
            </Typography>
            {!isWorker && role !== 'admin' && <Button component={Link} to="/#workers" variant="contained" sx={{ mt: 2.5, color: '#173d36', bgcolor: '#b0ed7b', '&:hover': { bgcolor: '#c0f397' } }}>Find a professional</Button>}
          </Box>
          <Chip className="dashboard-role-chip" label={role === 'customer' ? 'Customer' : role === 'worker' ? 'Professional' : 'Administrator'} />
        </Box>

        <Box className="dashboard-stats">
          {[
            { label: 'Total requests', value: stats.total, icon: <FaCalendarAlt /> },
            { label: 'Active', value: stats.active, icon: <FaClock /> },
            { label: 'Completed', value: stats.completed, icon: <FaCheck /> },
          ].map((stat) => (
            <Card key={stat.label} className="dashboard-stat" elevation={0} sx={{ border: '1px solid #e6ece7', borderRadius: 4 }}>
              <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                <Box><Typography color="text.secondary" variant="body2">{stat.label}</Typography><Typography variant="h4" sx={{ mt: 0.5, fontWeight: 800 }}>{stat.value}</Typography></Box>
                <Avatar sx={{ bgcolor: '#e8f5e2', color: '#287d59' }}>{stat.icon}</Avatar>
              </Stack>
            </Card>
          ))}
        </Box>

        <Box className="dashboard-bookings-toolbar">
          <Box className="dashboard-filter-tabs">
            <Tabs value={activeFilter} onChange={(_event, value) => setActiveFilter(value)} variant="scrollable" scrollButtons="auto" aria-label="Filter bookings">
              <Tab value="all" label={`All (${stats.total})`} />
              <Tab value="active" label={`Active (${stats.active})`} />
              <Tab value="completed" label={`Completed (${stats.completed})`} />
              <Tab value="cancelled" label={`Cancelled (${bookings.filter((booking) => booking.status === 'cancelled').length})`} />
            </Tabs>
          </Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }} className="dashboard-booking-tools">
            <TextField
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search bookings"
              size="small"
              aria-label="Search bookings"
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><FaSearch color="#718078" /></InputAdornment> } }}
              sx={{ width: { xs: '100%', sm: 260 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 99 } }}
            />
            <Tooltip title="Refresh bookings">
              <span><IconButton aria-label="Refresh bookings" onClick={() => setRefreshKey((key) => key + 1)} disabled={loading} sx={{ border: '1px solid #dfe8df', bgcolor: '#fff' }}><FaSyncAlt size={14} /></IconButton></span>
            </Tooltip>
          </Stack>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}
        {loading ? (
          <Stack spacing={2} sx={{ alignItems: 'center', py: 8 }}><CircularProgress /><Typography color="text.secondary">Loading your bookings…</Typography></Stack>
        ) : bookings.length === 0 ? (
          <Card elevation={0} sx={{ p: { xs: 3, sm: 5 }, border: '1px dashed #c8d6ca', borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>{isWorker ? 'No assigned jobs yet' : 'No bookings yet'}</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>{isWorker ? 'New requests assigned to you will show up here.' : 'Find a professional and send your first booking request.'}</Typography>
            {!isWorker && <Button component={Link} to="/#workers" variant="contained" sx={{ mt: 2 }}>Explore professionals</Button>}
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card elevation={0} sx={{ p: { xs: 3, sm: 5 }, border: '1px dashed #c8d6ca', borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>No bookings match this view</Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>Try another status filter or search term.</Typography>
            <Button onClick={() => { setActiveFilter('all'); setSearchTerm(''); }} sx={{ mt: 1.5, color: '#287d59' }}>Clear filters</Button>
          </Card>
        ) : (
          <Stack spacing={1.5}>
            {filteredBookings.map((booking) => (
              <Card key={booking._id} className="booking-card" elevation={0} sx={{ border: '1px solid #e6ece7', borderRadius: 4 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ justifyContent: 'space-between' }}>
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>{booking.serviceName || booking.serviceId || 'Service request'}</Typography>
                      <Chip size="small" color={statusColor[booking.status] || 'default'} label={booking.status || 'pending'} sx={{ textTransform: 'capitalize', fontWeight: 700 }} />
                    </Stack>
                    <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>{isWorker ? `Customer: ${booking.customerId?.name || 'SkillConnect customer'}` : `Professional: ${booking.workerName || 'To be assigned'}`}</Typography>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 1.5, color: '#65736f' }}><FaCalendarAlt size={13} /><Typography variant="body2">{dateLabel(booking.scheduledFor)}</Typography></Stack>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mt: 0.75, color: '#65736f' }}><FaMapMarkerAlt size={13} /><Typography variant="body2">{booking.address}</Typography></Stack>
                    {booking.description && <Typography variant="body2" sx={{ mt: 1.5, lineHeight: 1.65 }}>{booking.description}</Typography>}
                  </Box>
                  <Stack direction="row" spacing={0.5} sx={{ alignItems: { sm: 'flex-start' }, justifyContent: 'flex-start' }}>
                    {updatingId === booking._id ? <CircularProgress size={22} /> : actionsFor(booking)}
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}
