import { useEffect, useState } from 'react';
import { Alert, Avatar, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Divider, Rating, Stack, Typography } from '@mui/material';
import { FaArrowLeft, FaArrowRight, FaCheck, FaClock, FaMapMarkerAlt, FaStar, FaToolbox } from 'react-icons/fa';
import { Link, useParams } from 'react-router-dom';
import { getWorkerById } from '../api/client';
import BookingDialog from './BookingDialog';

function ProfileStat({ label, value, icon }) {
  return (
    <Card className="worker-profile-stat" elevation={0}>
      <Avatar>{icon}</Avatar>
      <Typography variant="h6">{value}</Typography>
      <Typography variant="caption">{label}</Typography>
    </Card>
  );
}

export default function WorkerProfilePage({ token, user, onNeedAuth, notify }) {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    getWorkerById(id)
      .then((result) => { if (active) setWorker(result); })
      .catch((reason) => { if (active) setError(reason.message || 'This professional profile could not be loaded.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const requestBooking = () => {
    if (!token) {
      onNeedAuth();
      return;
    }
    setBookingOpen(true);
  };

  if (loading) {
    return <Box className="worker-profile-loading"><CircularProgress /><Typography color="text.secondary">Loading professional profile…</Typography></Box>;
  }

  if (error || !worker) {
    return (
      <Container maxWidth="md" className="worker-profile-page">
        <Alert severity="error" sx={{ mt: 6, borderRadius: 3 }}>{error || 'Professional profile not found.'}</Alert>
        <Button component={Link} to="/" startIcon={<FaArrowLeft />} sx={{ mt: 2 }}>Back to SkillConnect</Button>
      </Container>
    );
  }

  const rating = Number(worker.rating);
  const hasRating = Number.isFinite(rating) && rating > 0;

  return (
    <main className="worker-profile-page">
      <Container maxWidth="lg">
        <Button component={Link} to="/#workers" startIcon={<FaArrowLeft />} className="worker-profile-back">Back to professionals</Button>

        {worker.isDemo && <Alert severity="info" className="worker-demo-notice">Sample profile for browsing and testing. Experience and ratings are illustrative, not verified claims.</Alert>}

        <Card className="worker-profile-hero" elevation={0}>
          <div className="worker-profile-photo-wrap">
            <img src={worker.imageUrl} alt={worker.name} className="worker-profile-photo" />
            {worker.isDemo
              ? <Chip label="Demo profile" className="worker-profile-photo-chip" />
              : worker.verified && <Chip icon={<FaCheck size={10} />} label="Verified profile" className="worker-profile-photo-chip" />}
          </div>
          <CardContent className="worker-profile-intro">
            <div className="eyebrow">{worker.serviceId?.replace('-', ' ') || 'Independent professional'}</div>
            <Typography component="h1" variant="h3" className="worker-profile-name">{worker.name}</Typography>
            <Typography className="worker-profile-skill">{worker.skill}</Typography>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
              {hasRating ? <><Rating value={rating} precision={0.1} readOnly /><Typography fontWeight={800}>{rating.toFixed(1)}</Typography></> : <Typography color="text.secondary">New profile · No ratings yet</Typography>}
              {worker.reviewCount > 0 && <Typography variant="body2" color="text.secondary">({worker.reviewCount} {worker.isDemo ? 'sample ' : ''}reviews)</Typography>}
            </Stack>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 2 }}>
              {worker.verified && !worker.isDemo && <Chip icon={<FaCheck size={10} />} label="Identity checked" color="success" variant="outlined" />}
              {(worker.serviceAreas || []).map((area) => <Chip key={area} icon={<FaMapMarkerAlt size={11} />} label={area} variant="outlined" />)}
            </Stack>
            <Button onClick={requestBooking} variant="contained" endIcon={<FaArrowRight />} className="worker-profile-book">Request a booking</Button>
          </CardContent>
        </Card>

        <Box className="worker-profile-stats">
          <ProfileStat label="Years of experience" value={worker.experienceYears != null ? `${worker.experienceYears}+` : 'Not listed'} icon={<FaToolbox />} />
          <ProfileStat label={worker.isDemo ? 'Sample jobs' : 'Completed jobs'} value={worker.completedJobs || '—'} icon={<FaCheck />} />
          <ProfileStat label="Typical response" value={worker.responseTime || 'Ask for availability'} icon={<FaClock />} />
          <ProfileStat label="Customer rating" value={hasRating ? `${rating.toFixed(1)} / 5` : 'New profile'} icon={<FaStar />} />
        </Box>

        <Box className="worker-profile-details">
          <Card className="worker-profile-about" elevation={0}>
            <CardContent>
              <Typography variant="h5" className="worker-profile-section-title">About {worker.name.split(' ')[0]}</Typography>
              <Typography color="text.secondary" lineHeight={1.8}>{worker.bio || 'This professional has not added a profile description yet.'}</Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" className="worker-profile-section-title">Specialties</Typography>
              {worker.specialties?.length
                ? <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.5 }}>{worker.specialties.map((specialty) => <Chip key={specialty} label={specialty} />)}</Stack>
                : <Typography color="text.secondary" sx={{ mt: 1 }}>Specialties have not been added yet.</Typography>}
            </CardContent>
          </Card>
          <Card className="worker-profile-facts" elevation={0}>
            <CardContent>
              <Typography variant="h6" className="worker-profile-section-title">Profile details</Typography>
              <Box className="worker-profile-fact"><span>Service</span><strong>{worker.skill}</strong></Box>
              <Box className="worker-profile-fact"><span>Experience</span><strong>{worker.experienceYears != null ? `${worker.experienceYears} years` : 'Not listed'}</strong></Box>
              <Box className="worker-profile-fact"><span>Service area</span><strong>{worker.serviceAreas?.join(', ') || 'Not listed'}</strong></Box>
              <Box className="worker-profile-fact"><span>Languages</span><strong>{worker.languages?.join(', ') || 'Not listed'}</strong></Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
      <BookingDialog worker={bookingOpen ? worker : null} token={token} user={user} onClose={() => setBookingOpen(false)} notify={notify} />
    </main>
  );
}
