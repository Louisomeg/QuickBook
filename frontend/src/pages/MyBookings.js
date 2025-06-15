import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Card, CardContent, Button, Grid } from '@mui/material';

const MyBookings = () => {
  const [laundry, setLaundry] = useState([]);
  const [common, setCommon] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await axios.get('/api/laundry/bookings');
      setLaundry(res.data);
      const res2 = await axios.get('/api/commonarea/bookings');
      setCommon(res2.data);
    };
    fetchBookings();
  }, []);

  const cancelLaundry = async (id) => {
    await axios.delete(`/api/laundry/bookings/${id}`);
    setLaundry(laundry.filter((b) => b.id !== id));
  };

  const cancelCommon = async (id) => {
    await axios.delete(`/api/commonarea/bookings/${id}`);
    setCommon(common.filter((b) => b.id !== id));
  };

  return (
    <Box p={3} pb={10}>
      <Typography variant="h5" gutterBottom>My Laundry Bookings</Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {laundry.map((b) => (
          <Grid item xs={12} md={6} key={b.id}>
            <Card>
              <CardContent>
                <Typography>ID: {b.id}</Typography>
                <Typography>Machine: {b.machineId}</Typography>
                <Typography>From: {new Date(b.startTime).toLocaleString()}</Typography>
                <Typography>To: {new Date(b.endTime).toLocaleString()}</Typography>
                <Typography>Status: {b.status}</Typography>
                {b.status === 'confirmed' && <Button onClick={() => cancelLaundry(b.id)} sx={{ mt: 1 }}>Cancel</Button>}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" gutterBottom>My Common Area Bookings</Typography>
      <Grid container spacing={2}>
        {common.map((b) => (
          <Grid item xs={12} md={6} key={b.id}>
            <Card>
              <CardContent>
                <Typography>ID: {b.id}</Typography>
                <Typography>Area: {b.areaName}</Typography>
                <Typography>Date: {b.date}</Typography>
                <Typography>From: {new Date(b.startTime).toLocaleString()}</Typography>
                <Typography>To: {new Date(b.endTime).toLocaleString()}</Typography>
                <Typography>Status: {b.status}</Typography>
                {b.status === 'confirmed' && <Button onClick={() => cancelCommon(b.id)} sx={{ mt: 1 }}>Cancel</Button>}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MyBookings;