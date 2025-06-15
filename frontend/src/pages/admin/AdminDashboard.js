import React, { useContext } from 'react';
import { Typography, Box, Button, Grid } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Welcome, {user?.firstName} (Admin).
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="outlined" onClick={() => navigate('/admin/users')}>User Management</Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => navigate('/admin/machines')}>Machine Management</Button>
        </Grid>
        <Grid item>
          <Button variant="outlined" onClick={() => navigate('/admin/analytics')}>Analytics</Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;