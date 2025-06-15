import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await axios.get('/api/admin/users');
    setUsers(res.data.users);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const toggleActive = async (id, isActive) => {
    await axios.put(`/api/admin/users/${id}`, { isActive: !isActive });
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await axios.delete(`/api/admin/users/${id}`);
    fetchUsers();
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={4}><CircularProgress /></Box>;
  }

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>User Management</Typography>
      <Paper sx={{ width: '100%', overflow: 'hidden' }} elevation={3}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Room</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Active</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.firstName} {u.lastName}</TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>{u.roomNumber}</TableCell>
                <TableCell>{u.role}</TableCell>
                <TableCell>{u.isActive ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button size="small" onClick={() => toggleActive(u.id, u.isActive)}>
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button size="small" color="error" onClick={() => deleteUser(u.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default UserManagement;