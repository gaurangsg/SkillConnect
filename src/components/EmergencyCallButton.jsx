import { Button } from '@mui/material';
import { FaPhoneAlt } from 'react-icons/fa';
import { useLocation } from 'react-router-dom';
import { supportPhone, supportPhoneDisplay } from '../data/contact';

export default function EmergencyCallButton() {
  const { pathname } = useLocation();
  const isAdminPage = pathname === '/admin';
  return (
    <Button
      className={`emergency-call-button ${isAdminPage ? 'admin-emergency-call' : ''}`}
      component="a"
      href={`tel:${supportPhone}`}
      startIcon={<FaPhoneAlt />}
      aria-label={`Emergency? Call SkillConnect support at ${supportPhoneDisplay}`}
    >
      <span className="emergency-call-copy">
        <span className="emergency-call-label">Emergency call</span>
        <span className="emergency-call-number">{supportPhoneDisplay}</span>
      </span>
    </Button>
  );
}
