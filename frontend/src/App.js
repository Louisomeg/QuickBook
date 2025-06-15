import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import AuthProvider from './context/AuthContext';
import NotificationProvider from './context/NotificationContext';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './pages/Dashboard';
import LaundryBooking from './pages/LaundryBooking';
import CommonAreaBooking from './pages/CommonAreaBooking';
import MyBookings from './pages/MyBookings';
import SuggestionsPage from './pages/Suggestions';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import MachineManagement from './pages/admin/MachineManagement';
import Analytics from './pages/admin/Analytics';
import Navigation from './components/Common/Navigation';
import PrivateRoute from './utils/PrivateRoute';
import AdminRoute from './utils/AdminRoute';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <NotificationProvider>
          <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/laundry"
            element={
              <PrivateRoute>
                <LaundryBooking />
              </PrivateRoute>
            }
          />
          <Route
            path="/common"
            element={
              <PrivateRoute>
                <CommonAreaBooking />
              </PrivateRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <PrivateRoute>
                <MyBookings />
              </PrivateRoute>
            }
          />
          <Route
            path="/suggestions"
            element={
              <PrivateRoute>
                <SuggestionsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/machines"
            element={
              <AdminRoute>
                <MachineManagement />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <AdminRoute>
                <Analytics />
              </AdminRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <Navigation />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;