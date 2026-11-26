import { useEffect, useMemo, useState } from 'react';
import { Alert, Avatar, Button, Card, CardContent, Chip, InputAdornment, Rating, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { motion as Motion } from 'framer-motion';
import { FaArrowRight, FaCheck, FaSearch, FaSlidersH } from 'react-icons/fa';
import { getWorkers } from '../api/client';
import BookingDialog from './BookingDialog';

const serviceSkill = { carpentry: ['carpenter'], electrician: ['electrician'], plumbing: ['plumber'], painting: ['painter'], cleaning: ['cleaner'], 'ac-repair': ['ac technician', 'hvac'], masonry: ['mason', 'welder', 'site observer'], gardening: ['gardener'] };

export default function WorkersSection({ token, user, initialSearch = '', selectedService = '', onClearService, onNeedAuth, notify }) {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [bookingWorker, setBookingWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setSearch(initialSearch); }, [initialSearch]);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const timer = window.setTimeout(() => {
      getWorkers(search).then((result) => { if (active) setWorkers(result); }).catch((reason) => { if (active) setError(reason.message); }).finally(() => { if (active) setLoading(false); });
    }, 180);
    return () => { active = false; window.clearTimeout(timer); };
  }, [search]);

  const filteredWorkers = useMemo(() => workers.filter((worker) => {
    if (!selectedService) return true;
    const allowed = serviceSkill[selectedService] || [];
    return allowed.some((skill) => worker.skill?.toLowerCase().includes(skill));
  }), [workers, selectedService]);

  const book = (worker) => {
    if (!token) { onNeedAuth(); return; }
    setBookingWorker(worker);
  };

  return (
    <section id="workers" className="section-pad workers-section">
      <div className="section-wrap">
        <div className="eyebrow">Skilled, independent professionals</div>
        <div className="section-heading-row" style={{ marginBottom: 22 }}>
          <div><h2 className="section-title">People who take pride in good work.</h2><p className="section-copy">Explore local profiles, see their service specialty, then send a request when you are ready.</p></div>
          <Chip icon={<FaCheck size={11} />} label="Profiles you can explore" sx={{ bgcolor: '#e8f5e2', color: '#267551', fontWeight: 700, px: 0.5 }} />
        </div>
        <div className="worker-toolbar">
          <TextField value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a name or skill" size="small" aria-label="Search workers" sx={{ width: { xs: '100%', sm: 360 }, '& .MuiOutlinedInput-root': { bgcolor: '#fff', borderRadius: 99 } }} slotProps={{ input: { startAdornment: <InputAdornment position="start"><FaSearch color="#718078" /></InputAdornment> } }} />
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', color: 'text.secondary' }}><FaSlidersH /><Typography variant="body2">{selectedService ? `Filtered by ${selectedService.replace('-', ' ')}` : 'Browse all specialties'}</Typography>{selectedService && <Button size="small" onClick={onClearService}>Clear</Button>}</Stack>
        </div>
        {error && <Alert severity="warning" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}
        <div className="worker-grid">
          {loading ? Array.from({ length: 4 }, (_, index) => <Card key={index} sx={{ overflow: 'hidden', borderRadius: 4 }}><Skeleton variant="rectangular" height={220} /><CardContent><Skeleton width="55%" /><Skeleton width="35%" /><Skeleton variant="rounded" height={40} sx={{ mt: 2 }} /></CardContent></Card>) : filteredWorkers.map((worker, index) => (
            <Motion.div key={worker.id || worker._id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.42, delay: index * 0.04 }}>
              <Card className="worker-card" elevation={0}>
                <div className="worker-photo-wrap"><img className="worker-photo" src={worker.imageUrl} alt={worker.name} loading="lazy" />{worker.verified && <Chip className="worker-verified" icon={<FaCheck size={10} />} label="Verified profile" size="small" />}</div>
                <CardContent className="worker-content">
                  <Typography variant="h6" sx={{ fontWeight: 800, fontSize: 18 }}>{worker.name}</Typography>
                  <div className="worker-skill">{worker.skill}</div>
                  <div className="worker-meta"><Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}><Rating value={Number(worker.rating) || 0} precision={0.1} readOnly size="small" /><b>{Number(worker.rating || 0).toFixed(1)}</b></Stack><Stack direction="row" spacing={0.7} sx={{ alignItems: 'center' }}><Avatar sx={{ width: 22, height: 22, bgcolor: '#e9f4e2', color: '#32734e', fontSize: 11 }}><FaCheck size={9} /></Avatar>Local pro</Stack></div>
                  <Button fullWidth onClick={() => book(worker)} variant="contained" endIcon={<FaArrowRight size={12} />} sx={{ bgcolor: '#173d36', '&:hover': { bgcolor: '#225848' } }}>Request a booking</Button>
                </CardContent>
              </Card>
            </Motion.div>
          ))}
          {!loading && filteredWorkers.length === 0 && <div className="worker-empty"><FaSearch style={{ marginBottom: 10 }} /><Typography variant="h6" sx={{ fontWeight: 800 }}>No matching professionals yet</Typography><Typography sx={{ mt: 1 }}>Try another service or search term.</Typography></div>}
        </div>
      </div>
      <BookingDialog worker={bookingWorker} token={token} user={user} onClose={() => setBookingWorker(null)} notify={notify} />
    </section>
  );
}
