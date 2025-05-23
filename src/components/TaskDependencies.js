import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  SubdirectoryArrowRight as SubtaskIcon,
  Link as LinkIcon
} from '@mui/icons-material';
import axios from 'axios';

const TaskDependencies = ({ task, onUpdate }) => {
  const [dependencies, setDependencies] = useState([]);
  const [subtasks, setSubtasks] = useState([]);
  const [availableTasks, setAvailableTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDependencyDialog, setOpenDependencyDialog] = useState(false);
  const [openSubtaskDialog, setOpenSubtaskDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    fetchDependencies();
    fetchSubtasks();
    fetchAvailableTasks();
  }, [task.id]);

  const fetchDependencies = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/${task.id}/dependencies`);
      setDependencies(response.data);
    } catch (error) {
      console.error('Error fetching dependencies:', error);
      setError('Failed to load dependencies');
    }
  };

  const fetchSubtasks = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/${task.id}/subtasks`);
      setSubtasks(response.data);
    } catch (error) {
      console.error('Error fetching subtasks:', error);
      setError('Failed to load subtasks');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTasks = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/tasks');
      // Filter out current task and its subtasks
      const filteredTasks = response.data.filter(t => 
        t.id !== task.id && !subtasks.some(st => st.id === t.id)
      );
      setAvailableTasks(filteredTasks);
    } catch (error) {
      console.error('Error fetching available tasks:', error);
      setError('Failed to load available tasks');
    }
  };

  const handleAddDependency = async () => {
    if (!selectedTask) return;

    try {
      await axios.post(`http://localhost:8080/api/tasks/${task.id}/dependencies`, {
        dependencyId: selectedTask.id
      });
      fetchDependencies();
      setOpenDependencyDialog(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Error adding dependency:', error);
      setError('Failed to add dependency');
    }
  };

  const handleRemoveDependency = async (dependencyId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${task.id}/dependencies/${dependencyId}`);
      fetchDependencies();
    } catch (error) {
      console.error('Error removing dependency:', error);
      setError('Failed to remove dependency');
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    try {
      const response = await axios.post(`http://localhost:8080/api/tasks/${task.id}/subtasks`, {
        title: newSubtaskTitle,
        status: 'PENDING',
        priority: 'MEDIUM',
        category: task.category
      });
      setSubtasks([...subtasks, response.data]);
      setOpenSubtaskDialog(false);
      setNewSubtaskTitle('');
    } catch (error) {
      console.error('Error adding subtask:', error);
      setError('Failed to add subtask');
    }
  };

  const handleRemoveSubtask = async (subtaskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${subtaskId}`);
      setSubtasks(subtasks.filter(st => st.id !== subtaskId));
    } catch (error) {
      console.error('Error removing subtask:', error);
      setError('Failed to remove subtask');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Dependencies Section */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            Dependencies
          </Typography>
          <Button
            startIcon={<LinkIcon />}
            onClick={() => setOpenDependencyDialog(true)}
            size="small"
          >
            Add Dependency
          </Button>
        </Box>
        <List>
          {dependencies.map((dependency) => (
            <ListItem
              key={dependency.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveDependency(dependency.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={dependency.title}
                secondary={`Status: ${dependency.status}`}
              />
            </ListItem>
          ))}
          {dependencies.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No dependencies"
                secondary="Add dependencies to track related tasks"
              />
            </ListItem>
          )}
        </List>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Subtasks Section */}
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6">
            Subtasks
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={() => setOpenSubtaskDialog(true)}
            size="small"
          >
            Add Subtask
          </Button>
        </Box>
        <List>
          {subtasks.map((subtask) => (
            <ListItem
              key={subtask.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => handleRemoveSubtask(subtask.id)}
                >
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemIcon>
                <SubtaskIcon />
              </ListItemIcon>
              <ListItemText
                primary={subtask.title}
                secondary={`Status: ${subtask.status}`}
              />
            </ListItem>
          ))}
          {subtasks.length === 0 && (
            <ListItem>
              <ListItemText
                primary="No subtasks"
                secondary="Break down complex tasks into smaller subtasks"
              />
            </ListItem>
          )}
        </List>
      </Box>

      {/* Add Dependency Dialog */}
      <Dialog open={openDependencyDialog} onClose={() => setOpenDependencyDialog(false)}>
        <DialogTitle>Add Dependency</DialogTitle>
        <DialogContent>
          <Autocomplete
            options={availableTasks}
            getOptionLabel={(option) => option.title}
            value={selectedTask}
            onChange={(event, newValue) => setSelectedTask(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select Task"
                variant="outlined"
                fullWidth
                margin="normal"
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDependencyDialog(false)}>Cancel</Button>
          <Button onClick={handleAddDependency} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Subtask Dialog */}
      <Dialog open={openSubtaskDialog} onClose={() => setOpenSubtaskDialog(false)}>
        <DialogTitle>Add Subtask</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Subtask Title"
            fullWidth
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSubtaskDialog(false)}>Cancel</Button>
          <Button onClick={handleAddSubtask} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDependencies; 