import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    switch (location.pathname) {
      case '/dashboard': setValue(0); break;
      case '/laundry': setValue(1); break;
      case '/common': setValue(2); break;
      case '/bookings': setValue(3); break;
      case '/suggestions': setValue(4); break;
      case '/profile': setValue(5); break;
      default: setValue(0);
    }
  }, [location.pathname]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    const routes = ['/dashboard', '/laundry', '/common', '/bookings', '/suggestions', '/profile'];
    navigate(routes[newValue]);
  };

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation value={value} onChange={handleChange} showLabels>
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Laundry" icon={<LocalLaundryServiceIcon />} />
        <BottomNavigationAction label="Common" icon={<MeetingRoomIcon />} />
        <BottomNavigationAction label="Bookings" icon={<CalendarTodayIcon />} />
        <BottomNavigationAction label="Suggestions" icon={<MessageIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation;