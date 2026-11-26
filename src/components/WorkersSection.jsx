import { useEffect, useMemo, useState } from 'react';
import { Alert, Avatar, Button, Card, CardContent, Chip, InputAdornment, Pagination, Rating, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { motion as Motion } from 'framer-motion';
import { FaArrowRight, FaCheck, FaSearch, FaSlidersH } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getWorkers } from '../api/client';
import BookingDialog from './BookingDialog';

const resultsPerPage = 12;

export default function WorkersSection({ token, user, initialSearch = '', selectedService = '', onClearService, onNeedAuth, notify }) {
  const [workers, setWorkers] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [bookingWorker, setBookingWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { setSearch(initialSearch); }, [initialSearch]);
  useEffect(() => { setPage(1); }, [search, selectedService]);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const timer = window.setTimeout(() => {
      getWorkers(search, selectedService).then((result) => { if (active) setWorkers(result); }).catch((reason) => { if (active) setError(reason.message); }).finally(() => { if (active) setLoading(false); });
    }, 180);
    return () => { active = false; window.clearTimeout(timer); };
  }, [search, selectedService]);

  const visibleWorkers = useMemo(() => workers.slice((page - 1) * resultsPerPage, page * resultsPerPage), [page, workers]);

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
          {loading ? Array.from({ length: 4 }, (_, index) => <Card key={index} sx={{ overflow: 'hidden', borderRadius: 4 }}><Skeleton variant="rectangular" height={220} /><CardContent><Skeleton width="55%" /><Skeleton width="35%" /><Skeleton variant="rounded" height={40} sx={{ mt: 2 }} /></CardContent></Card>) : visibleWorkers.map((worker, index) => (
            <Motion.div key={worker.id || worker._id} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.42, delay: index * 0.04 }}>
              <Card className="worker-card" elevation={0}>
                <Link className="worker-photo-link" to={`/professionals/${encodeURIComponent(worker.id || worker._id)}`} aria-label={`View ${worker.name}'s profile`}>
                  <div className="worker-photo-wrap"><img className="worker-photo" src={worker.imageUrl} alt={worker.name} loading="lazy" />{worker.isDemo && !worker.featured ? <Chip className="worker-verified" label="Demo profile" size="small" /> : worker.verified && <Chip className="worker-verified" icon={<FaCheck size={10} />} label="Verified profile" size="small" />}</div>
                </Link>
                <CardContent className="worker-content">
                  <Typography component={Link} to={`/professionals/${encodeURIComponent(worker.id || worker._id)}`} variant="h6" className="worker-name-link" sx={{ fontWeight: 800, fontSize: 18 }}>{worker.name}</Typography>
                  <div className="worker-skill">{worker.skill}</div>
                  <div className="worker-meta"><Stack direction="row" spacing={0.8} sx={{ alignItems: 'center' }}><Rating value={Number(worker.rating) || 0} precision={0.1} readOnly size="small" /><b>{Number(worker.rating || 0).toFixed(1)}</b></Stack><Stack direction="row" spacing={0.7} sx={{ alignItems: 'center' }}><Avatar sx={{ width: 22, height: 22, bgcolor: '#e9f4e2', color: '#32734e', fontSize: 11 }}><FaCheck size={9} /></Avatar>Local pro</Stack></div>
                  <Button fullWidth onClick={() => book(worker)} variant="contained" endIcon={<FaArrowRight size={12} />} sx={{ bgcolor: '#173d36', '&:hover': { bgcolor: '#225848' } }}>Request a booking</Button>
                </CardContent>
              </Card>
            </Motion.div>
          ))}
          {!loading && workers.length === 0 && <div className="worker-empty"><FaSearch style={{ marginBottom: 10 }} /><Typography variant="h6" sx={{ fontWeight: 800 }}>No matching professionals yet</Typography><Typography sx={{ mt: 1 }}>Try another service or search term.</Typography></div>}
        </div>
        {!loading && workers.length > resultsPerPage && <Stack alignItems="center" sx={{ mt: 4 }}><Pagination page={page} count={Math.ceil(workers.length / resultsPerPage)} onChange={(_event, nextPage) => setPage(nextPage)} color="primary" aria-label="Professional results pages" /><Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>Showing {Math.min((page - 1) * resultsPerPage + 1, workers.length)}–{Math.min(page * resultsPerPage, workers.length)} of {workers.length} professionals</Typography></Stack>}
      </div>
      <BookingDialog worker={bookingWorker} token={token} user={user} onClose={() => setBookingWorker(null)} notify={notify} />
    </section>
  );
}
