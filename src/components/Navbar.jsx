import { useState } from 'react';
import { AppBar, Avatar, Box, Button, Container, IconButton, Menu, MenuItem, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowRight, FaBars, FaBolt, FaBriefcase, FaChevronDown, FaCompass, FaHammer, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';

const navLinks = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Professionals', href: '/#workers' },
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'Reviews', href: '/#reviews' },
];

export default function Navbar({ user, onOpenAuth, onLogout }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const goTo = (href) => {
    setMobileOpen(false);
    if (href.startsWith('/#') && location.pathname !== '/') {
      navigate(href);
      return;
    }
    if (href.startsWith('/#')) {
      const id = href.slice(2);
      if (id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else navigate(href);
  };

  const dashboardPath = user?.role === 'worker' ? '/worker/dashboard' : user?.role === 'admin' ? '/admin' : '/account';

  return (
    <AppBar position="sticky" className="site-header" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ minHeight: '76px !important', gap: 3 }}>
          <Link className="nav-brand" to="/" aria-label="SkillConnect home">
            <span className="nav-mark"><FaHammer size={16} /></span>
            <span>skill<span style={{ color: '#4b9a6e' }}>connect</span></span>
          </Link>

          <Stack direction="row" spacing={3.2} sx={{ ml: 3, display: { xs: 'none', lg: 'flex' } }}>
            {navLinks.map((item) => <button type="button" key={item.label} className="nav-link" onClick={() => goTo(item.href)}>{item.label}</button>)}
          </Stack>

          <Box sx={{ flex: 1 }} />
          <Stack direction="row" spacing={1.2} sx={{ alignItems: 'center', display: { xs: 'none', sm: 'flex' } }}>
            {user ? (
              <>
                <Tooltip title={user.role === 'admin' ? 'Open admin console' : 'Open your dashboard'}>
                  <Button color="inherit" startIcon={<Avatar sx={{ width: 28, height: 28, bgcolor: '#dff2d3', color: '#235d46', fontSize: 13 }}>{user.name?.[0]?.toUpperCase() || 'U'}</Avatar>} endIcon={<FaChevronDown size={11} />} onClick={(event) => setAnchorEl(event.currentTarget)} sx={{ color: '#344640', pr: 1 }}>
                    {user.name?.split(' ')[0] || 'Account'}
                  </Button>
                </Tooltip>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)} slotProps={{ paper: { sx: { mt: 1.3, minWidth: 210, borderRadius: 3 } } }}>
                  <MenuItem onClick={() => { setAnchorEl(null); navigate(dashboardPath); }}><FaUserCircle style={{ marginRight: 12 }} />{user.role === 'admin' ? 'Admin console' : 'My dashboard'}</MenuItem>
                  <MenuItem onClick={() => { setAnchorEl(null); onLogout(); }}><FaSignOutAlt style={{ marginRight: 12 }} /> Sign out</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button color="inherit" onClick={onOpenAuth} sx={{ color: '#38534a' }}>Log in</Button>
                <Button variant="contained" endIcon={<FaArrowRight size={12} />} onClick={onOpenAuth} sx={{ px: 2.4, bgcolor: '#173d36', '&:hover': { bgcolor: '#225848' } }}>Get started</Button>
              </>
            )}
          </Stack>
          <IconButton onClick={() => setMobileOpen((open) => !open)} sx={{ display: { xs: 'inline-flex', lg: 'none' }, color: '#173d36' }} aria-label="Toggle navigation"><FaBars /></IconButton>
        </Toolbar>
        {mobileOpen && <Stack sx={{ pb: 2, display: { lg: 'none' } }} spacing={1}>
          {navLinks.map((item) => <Button key={item.label} onClick={() => goTo(item.href)} sx={{ justifyContent: 'flex-start', color: '#53625e' }}>{item.label}</Button>)}
          {user ? <Button onClick={() => navigate(dashboardPath)} startIcon={<FaBriefcase />}>{user.role === 'admin' ? 'Open admin console' : 'Open dashboard'}</Button> : <Button onClick={onOpenAuth} startIcon={<FaBolt />}>Log in / Sign up</Button>}
        </Stack>}
      </Container>
    </AppBar>
  );
}
