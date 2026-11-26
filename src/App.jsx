import { useEffect, useState } from 'react';
import { Alert, Box, CircularProgress, Snackbar } from '@mui/material';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthPanel from './components/AuthPanel';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/ServicesSection';
import Workers from './components/WorkersSection';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import DashboardPage from './components/DashboardPage';
import AdminDashboardPage from './components/AdminDashboardPage';
import HowItWorks from './components/HowItWorks';
import CTASection from './components/CTASection';
import EmergencyCallButton from './components/EmergencyCallButton';
import PasswordResetPage from './components/PasswordResetPage';
import WorkerProfilePage from './components/WorkerProfilePage';
import { getCurrentUser } from './api/client';

function Marketplace({ session, openAuth, notify }) {
  const [selectedService, setSelectedService] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const search = (value) => {
    setSearchTerm(value);
    if (value.trim()) document.getElementById('workers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <Hero onSearch={search} />
      <About />
      <Services selectedService={selectedService} onSelect={setSelectedService} />
      <Workers token={session.token} user={session.user} initialSearch={searchTerm} selectedService={selectedService} onClearService={() => setSelectedService('')} onNeedAuth={openAuth} notify={notify} />
      <HowItWorks />
      <Reviews />
      <CTASection onStart={openAuth} />
      <Footer />
    </>
  );
}

function App() {
  const [session, setSession] = useState(() => ({ token: localStorage.getItem('skillconnect_token'), user: null, loading: Boolean(localStorage.getItem('skillconnect_token')) }));
  const [authOpen, setAuthOpen] = useState(false);
  const [notice, setNotice] = useState({ open: false, message: '', severity: 'success' });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session.token) return;
    let active = true;
    getCurrentUser(session.token)
      .then(({ user }) => { if (active) setSession((current) => ({ ...current, user, loading: false })); })
      .catch(() => {
        localStorage.removeItem('skillconnect_token');
        if (active) setSession({ token: null, user: null, loading: false });
      });
    return () => { active = false; };
  }, [session.token]);

  useEffect(() => {
    if (location.hash) {
      requestAnimationFrame(() => document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    } else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.hash]);

  const authenticate = ({ token, user }) => {
    localStorage.setItem('skillconnect_token', token);
    setSession({ token, user, loading: false });
    setAuthOpen(false);
    setNotice({ open: true, message: `Welcome${user?.name ? `, ${user.name.split(' ')[0]}` : ' back'}! You're signed in.`, severity: 'success' });
    if (location.pathname === '/login' || location.pathname === '/signup') navigate('/account');
  };

  const logout = () => {
    localStorage.removeItem('skillconnect_token');
    setSession({ token: null, user: null, loading: false });
    navigate('/');
    setNotice({ open: true, message: 'You have been signed out securely.', severity: 'success' });
  };

  const notify = (message, severity = 'success') => setNotice({ open: true, message, severity });
  const openAuth = () => setAuthOpen(true);
  const navProps = { user: session.user, onOpenAuth: openAuth, onLogout: logout };

  return (
    <Box className="app-shell">
      <Navbar {...navProps} />
      <EmergencyCallButton />
      <main>
        {session.loading ? (
          <Box className="page-loader"><CircularProgress size={34} /><span>Securing your session…</span></Box>
        ) : (
          <Routes>
            <Route path="/" element={<Marketplace session={session} openAuth={openAuth} notify={notify} />} />
            <Route path="/account" element={<DashboardPage session={session} onOpenAuth={openAuth} onLogout={logout} notify={notify} />} />
            <Route path="/worker/dashboard" element={<DashboardPage session={session} onOpenAuth={openAuth} onLogout={logout} notify={notify} />} />
            <Route path="/admin" element={<AdminDashboardPage session={session} onOpenAuth={openAuth} onLogout={logout} notify={notify} />} />
            <Route path="/professionals/:id" element={<WorkerProfilePage token={session.token} user={session.user} onNeedAuth={openAuth} notify={notify} />} />
            <Route path="/reset-password" element={<PasswordResetPage onOpenAuth={openAuth} />} />
            <Route path="*" element={<Marketplace session={session} openAuth={openAuth} notify={notify} />} />
          </Routes>
        )}
      </main>
      <AuthPanel open={authOpen} onClose={() => setAuthOpen(false)} onAuthenticated={authenticate} />
      <Snackbar open={notice.open} autoHideDuration={4000} onClose={() => setNotice((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert variant="filled" severity={notice.severity} onClose={() => setNotice((current) => ({ ...current, open: false }))} sx={{ borderRadius: 3, boxShadow: '0 14px 40px #16233d33' }}>
          {notice.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default App;
