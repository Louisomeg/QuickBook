import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Paper, CircularProgress } from '@mui/material';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const res = await axios.get('/api/admin/analytics');
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  if (loading || !data) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Analytics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }} elevation={3}>
            <Typography variant="h6">Total Users</Typography>
            <Typography variant="h4">{data.totalUsers}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }} elevation={3}>
            <Typography variant="h6">Laundry Bookings</Typography>
            <Typography variant="h4">{data.totalLaundry}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2 }} elevation={3}>
            <Typography variant="h6">Common Area Bookings</Typography>
            <Typography variant="h4">{data.totalCommon}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;