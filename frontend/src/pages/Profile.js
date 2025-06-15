import React, { useContext } from 'react';
import { Typography, Box } from '@mui/material';
import { AuthContext } from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  return (
    <Box p={4}>
      <Typography variant="h4">Your Profile</Typography>
      <Typography variant="body1" sx={{ mt: 2 }}>
        Name: {user?.firstName} {user?.lastName}
      </Typography>
      <Typography variant="body1">Email: {user?.email}</Typography>
      <Typography variant="body1">Room: {user?.roomNumber}</Typography>
      <Typography variant="body1">Role: {user?.role}</Typography>
    </Box>
  );
};

export default Profile;