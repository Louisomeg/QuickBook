import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, Grid, Card, CardContent, Button, TextField, MenuItem } from '@mui/material';

const purposes = ['Party', 'Study', 'Meeting', 'Recreation'];

const CommonAreaBooking = () => {
  const [areaName, setAreaName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState('12:00');
  const [endTime, setEndTime] = useState('13:00');
  const [purpose, setPurpose] = useState(purposes[0]);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchRules = async () => {
      const res = await axios.get('/api/commonarea/rules');
      setRules(res.data.rules);
    };
    fetchRules();
  }, []);

  const handleBook = async () => {
    await axios.post('/api/commonarea/book', {
      areaName,
      date,
      startTime: new Date(`${date}T${startTime}`),
      endTime: new Date(`${date}T${endTime}`),
      purpose,
    });
    alert('Booking submitted');
  };

  return (
    <Box p={3} pb={10}>
      <Typography variant="h5" gutterBottom>Common Area Booking</Typography>
      <TextField
        label="Area Name"
        fullWidth
        sx={{ mb: 2 }}
        value={areaName}
        onChange={(e) => setAreaName(e.target.value)}
      />
      <TextField
        label="Date"
        type="date"
        fullWidth
        sx={{ mb: 2 }}
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={6}>
          <TextField
            label="Start Time"
            type="time"
            fullWidth
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            label="End Time"
            type="time"
            fullWidth
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </Grid>
      </Grid>
      <TextField
        select
        label="Purpose"
        fullWidth
        sx={{ mb: 2 }}
        value={purpose}
        onChange={(e) => setPurpose(e.target.value)}
      >
        {purposes.map((p) => (
          <MenuItem key={p} value={p}>{p}</MenuItem>
        ))}
      </TextField>
      <Button variant="contained" onClick={handleBook}>Book</Button>
      <Box mt={4}>
        <Typography variant="h6">Rules</Typography>
        {rules.map((r, idx) => (
          <Typography key={idx} variant="body2">- {r}</Typography>
        ))}
      </Box>
    </Box>
  );
};

export default CommonAreaBooking;