import React, { createContext, useState, useContext, useEffect } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    if (!token) return;
    const socket = io({
      auth: { token },
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
    });
    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setToastMessage(notification.message);
      setToastOpen(true);
    });
    // Optional: handle suggestion events for admins
    socket.on('newSuggestion', (suggestion) => {
      console.log('New suggestion received:', suggestion);
    });
    return () => {
      socket.disconnect();
    };
  }, [token]);

  return (
    <NotificationContext.Provider value={{ notifications }}>
      {children}
      {/* Real-time notification toast */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setToastOpen(false)} severity="info" sx={{ width: '100%' }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;