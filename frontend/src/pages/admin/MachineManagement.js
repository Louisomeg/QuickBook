import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';

const statuses = ['available', 'in-use', 'maintenance'];

const MachineManagement = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMachines = async () => {
    setLoading(true);
    const res = await axios.get('/api/laundry/machines');
    setMachines(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchMachines(); }, []);

  const updateStatus = async (id, status) => {
    await axios.put(`/api/admin/machines/${id}`, { status });
    fetchMachines();
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Machine Management</Typography>
      <Grid container spacing={2}>
        {machines.map((m) => (
          <Grid item xs={12} sm={6} md={4} key={m.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{m.name}</Typography>
                <Typography variant="body2">Type: {m.type}</Typography>
                <FormControl fullWidth sx={{ mt: 1 }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={m.status}
                    label="Status"
                    onChange={(e) => updateStatus(m.id, e.target.value)}
                  >
                    {statuses.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MachineManagement;