import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, MenuItem, Button, CircularProgress } from '@mui/material';
import BookingCalendar from '../components/Booking/BookingCalendar';
import ConfirmationModal from '../components/Booking/ConfirmationModal';

const LaundryBooking = () => {
  const [machines, setMachines] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [selectedMachineName, setSelectedMachineName] = useState('');
  const [date, setDate] = useState(new Date());
  const [availability, setAvailability] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchMachines = async () => {
      const res = await axios.get('/api/laundry/machines');
      setMachines(res.data);
    };
    fetchMachines();
  }, []);

  const checkAvailability = async () => {
    if (!selectedMachine) return;
    setLoading(true);
    const d = date.toISOString().split('T')[0];
    const res = await axios.get(`/api/laundry/availability/${d}`);
    const slots = res.data[selectedMachine] || [];
    setAvailability(slots);
    const evts = slots.map((s) => ({
      start: new Date(s.startTime),
      end: new Date(s.endTime),
      title: 'Booked',
    }));
    setEvents(evts);
    setLoading(false);
  };

  const handleConfirm = async () => {
    if (!booking) return;
    await axios.post('/api/laundry/book', {
      machineId: selectedMachine,
      startTime: booking.start,
      endTime: booking.end,
    });
    setModalOpen(false);
    checkAvailability();
  };

  return (
    <Box p={3} pb={10}>
      <Typography variant="h5">Laundry Booking</Typography>
      <TextField
        label="Select Machine"
        select
        fullWidth
        sx={{ my: 2 }}
        value={selectedMachine}
        onChange={(e) => {
          const m = machines.find((x) => x.id === e.target.value);
          setSelectedMachine(e.target.value);
          setSelectedMachineName(m?.name || '');
        }}
      >
        {machines.map((m) => (
          <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
        ))}
      </TextField>
      <TextField
        label="Select Date"
        type="date"
        fullWidth
        sx={{ mb: 2 }}
        value={date.toISOString().split('T')[0]}
        onChange={(e) => setDate(new Date(e.target.value))}
      />
      <Button
        variant="contained"
        disabled={!selectedMachine}
        onClick={checkAvailability}
      >Check Availability</Button>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      ) : (
        events.length > 0 && (
          <BookingCalendar
            events={events}
            onSelectSlot={({ start, end }) => {
              setBooking({ machineName: selectedMachineName, start, end });
              setModalOpen(true);
            }}
            onSelectEvent={() => {}}
          />
        )
      )}
      <ConfirmationModal
        open={modalOpen}
        booking={booking}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirm}
      />
    </Box>
  );
};

export default LaundryBooking;

export default LaundryBooking;