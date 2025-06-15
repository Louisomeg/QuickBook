import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
// QR code library
import QRCode from 'qrcode.react';

const ConfirmationModal = ({ open, onClose, onConfirm, booking }) => {
  if (!booking) return null;
  const { machineName, start, end } = booking;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Confirm Booking</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body1">Machine: {machineName}</Typography>
        <Typography variant="body1">From: {new Date(start).toLocaleString()}</Typography>
        <Typography variant="body1">To: {new Date(end).toLocaleString()}</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>Scan QR for details:</Typography>
        <QRCode value={`${machineName}-${start}-${end}`} size={128} level="H" />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => onConfirm(booking)}>Confirm</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;