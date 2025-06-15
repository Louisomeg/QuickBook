import React, { useContext } from 'react';
import { Typography, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  return (
    <Box p={4}>
      <Typography variant="h4">Welcome, {user?.firstName}!</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        This is your dashboard.
      </Typography>
    </Box>
  );
};

export default Dashboard;