import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import About from './components/About';
import Services from './components/ServicesSection';
import Workers from './components/WorkersSection';
import Hero from './components/Hero';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import Bookings from './components/BookingsSection';
import { getCurrentUser } from './api/client';


function App() {
  const [session, setSession] = useState(() => ({
    token: localStorage.getItem('skillconnect_token'),
    user: null,
  }));

  useEffect(() => {
    if (!session.token) return;
    getCurrentUser(session.token)
      .then(({ user }) => setSession((current) => ({ ...current, user })))
      .catch(() => {
        localStorage.removeItem('skillconnect_token');
        setSession({ token: null, user: null });
      });
  }, [session.token]);

  const authenticate = ({ token, user }) => {
    localStorage.setItem('skillconnect_token', token);
    setSession({ token, user });
  };

  const logout = () => {
    localStorage.removeItem('skillconnect_token');
    setSession({ token: null, user: null });
  };

  return (
    <>
      <Navbar user={session.user} onAuthenticated={authenticate} onLogout={logout} />
      <Hero />
      <About />
      <Services />
      <Workers token={session.token} />
      <Bookings token={session.token} role={session.user?.role} />
      {/* <Testimonials /> */}
      <Reviews />
      <Footer />
    </>

  );
}

export default App
