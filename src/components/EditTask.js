import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CircularProgress, Alert, Box } from '@mui/material';
import axios from 'axios';
import TaskForm from './TaskForm';

function EditTask({ onSubmit }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/tasks/${id}`);
        setTask(response.data);
        setError(null);
      } catch (error) {
        console.error('Error fetching task:', error);
        setError('Failed to load task. Please try again.');
        setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTask();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box m={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!task) {
    return (
      <Box m={2}>
        <Alert severity="error">Task not found</Alert>
      </Box>
    );
  }

  return <TaskForm task={task} onSubmit={onSubmit} />;
}

export default EditTask; 