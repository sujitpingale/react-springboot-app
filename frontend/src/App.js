import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { CssBaseline, Container, Snackbar, Alert, Box } from '@mui/material';
import Navbar from './components/Navbar';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import EditTask from './components/EditTask';
import Footer from './components/Footer';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import axios from 'axios';

// Protected Route component
const ProtectedRoute = ({ children, user }) => {
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
};

function AppContent() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setNotification({ 
      open: true, 
      message: 'Login successful!', 
      severity: 'success' 
    });
  };

  const handleSignupSuccess = (userData) => {
    setUser(userData);
    setNotification({ 
      open: true, 
      message: 'Account created successfully!', 
      severity: 'success' 
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setNotification({ 
      open: true, 
      message: 'Logged out successfully!', 
      severity: 'success' 
    });
  };

  const handleSubmit = async (formData) => {
    try {
      if (formData.id) {
        await axios.put(`http://localhost:8080/api/tasks/${formData.id}`, formData);
        setNotification({ open: true, message: 'Task updated successfully!', severity: 'success' });
      } else {
        // Add userId to the task data when creating a new task
        const taskData = {
          ...formData,
          userId: user.id
        };
        await axios.post('http://localhost:8080/api/tasks', taskData);
        setNotification({ open: true, message: 'Task created successfully!', severity: 'success' });
      }
      setTimeout(() => navigate('/'), 1500);
    } catch (error) {
      console.error('Error saving task:', error);
      setNotification({ 
        open: true, 
        message: error.response?.data?.message || 'Error saving task. Please try again.', 
        severity: 'error' 
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <CssBaseline />
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        minHeight: '100vh',
        pb: 12 // Increased padding bottom to prevent content from being hidden behind footer
      }}>
        <Navbar user={user} onLogout={handleLogout} />
        <Container sx={{ flex: 1 }}>
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/" /> : <Login onLoginSuccess={handleLoginSuccess} />
            } />
            <Route path="/signup" element={
              user ? <Navigate to="/" /> : <Signup onSignupSuccess={handleSignupSuccess} />
            } />
            <Route path="/" element={
              <ProtectedRoute user={user}>
                <TaskList />
              </ProtectedRoute>
            } />
            <Route path="/create" element={
              <ProtectedRoute user={user}>
                <TaskForm onSubmit={handleSubmit} />
              </ProtectedRoute>
            } />
            <Route path="/edit/:id" element={
              <ProtectedRoute user={user}>
                <EditTask onSubmit={handleSubmit} />
              </ProtectedRoute>
            } />
          </Routes>
        </Container>
        <Footer />
        <Snackbar 
          open={notification.open} 
          autoHideDuration={3000} 
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseNotification} severity={notification.severity}>
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
