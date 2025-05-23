import React, { useState, useEffect, useCallback } from 'react';
import { 
  Typography, 
  Box, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Alert,
  Fab,
  useTheme,
  useMediaQuery,
  Paper,
  Fade,
  Dialog
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SortIcon from '@mui/icons-material/Sort';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import TaskItem from './TaskItem';
import FlagIcon from '@mui/icons-material/Flag';
import CategoryIcon from '@mui/icons-material/Category';
import TaskDetails from './TaskDetails';

const CATEGORIES = [
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Education',
  'Finance',
  'Home',
  'Other'
];

const TaskList = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dueDate');
  const [sortOrder, setSortOrder] = useState('asc');
  const [error, setError] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const fetchTasks = useCallback(async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        setError('Please log in to view tasks');
        navigate('/login');
        return;
      }

      const user = JSON.parse(userStr);
      if (!user || !user.id) {
        setError('Invalid user data. Please log in again.');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const response = await axios.get(`http://localhost:8080/api/tasks?userId=${user.id}`);
      setTasks(response.data);
      setFilteredTasks(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please log in again.');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
      } else {
        setError('Failed to load tasks. Please try again.');
      }
    }
  }, [navigate]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    let result = [...tasks];

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(task => task.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'ALL') {
      result = result.filter(task => task.priority === priorityFilter);
    }

    // Apply category filter
    if (categoryFilter !== 'ALL') {
      result = result.filter(task => task.category === categoryFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'dueDate':
          comparison = new Date(a.dueDate) - new Date(b.dueDate);
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredTasks(result);
  }, [tasks, searchTerm, statusFilter, priorityFilter, categoryFilter, sortBy, sortOrder]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEdit = (task) => {
    navigate(`/edit/${task.id}`);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  const handleTaskUpdate = async (taskId, updatedTask) => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${taskId}`, updatedTask);
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${taskId}`);
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
  };

  const handleCloseDetails = () => {
    setSelectedTask(null);
  };

  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 4
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 600,
            color: 'primary.main'
          }}
        >
          My Tasks
        </Typography>
        {!isMobile && (
          <Chip 
            label={`${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
            sx={{ 
              borderRadius: 2,
              px: 1
            }}
          />
        )}
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2
          }}
        >
          {error}
        </Alert>
      )}

      {/* Search and Filter Section */}
      <Paper 
        elevation={0}
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search Tasks"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status Filter</InputLabel>
              <Select
                value={statusFilter}
                label="Status Filter"
                onChange={(e) => setStatusFilter(e.target.value)}
                startAdornment={<FilterListIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                sx={{
                  borderRadius: 2
                }}
              >
                <MenuItem value="ALL">All Status</MenuItem>
                <MenuItem value="TODO">To Do</MenuItem>
                <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Priority Filter</InputLabel>
              <Select
                value={priorityFilter}
                label="Priority Filter"
                onChange={(e) => setPriorityFilter(e.target.value)}
                startAdornment={<FlagIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                sx={{
                  borderRadius: 2
                }}
              >
                <MenuItem value="ALL">All Priorities</MenuItem>
                <MenuItem value="LOW">Low</MenuItem>
                <MenuItem value="MEDIUM">Medium</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
                <MenuItem value="URGENT">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category Filter</InputLabel>
              <Select
                value={categoryFilter}
                label="Category Filter"
                onChange={(e) => setCategoryFilter(e.target.value)}
                startAdornment={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                sx={{
                  borderRadius: 2
                }}
              >
                <MenuItem value="ALL">All Categories</MenuItem>
                {CATEGORIES.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Sort By</InputLabel>
              <Select
                value={sortBy}
                label="Sort By"
                onChange={(e) => setSortBy(e.target.value)}
                startAdornment={<SortIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                sx={{
                  borderRadius: 2
                }}
              >
                <MenuItem value="dueDate">Due Date</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Descending' : 'Ascending'}`}>
              <IconButton 
                onClick={toggleSortOrder}
                sx={{ 
                  height: '100%', 
                  width: '100%', 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2
                }}
              >
                <SortIcon sx={{ transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }} />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </Paper>

      {/* Task List */}
      <Box>
        {filteredTasks.map((task, index) => (
          <Fade in timeout={300} style={{ transitionDelay: `${index * 50}ms` }} key={task.id}>
            <Box>
              <TaskItem
                task={task}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onUpdate={handleTaskUpdate}
                onDeleteTask={handleTaskDelete}
                onClick={() => handleTaskClick(task)}
              />
            </Box>
          </Fade>
        ))}
        {filteredTasks.length === 0 && !error && (
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No tasks found
            </Typography>
          </Paper>
        )}
      </Box>

      {/* Floating Action Button for Mobile */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => navigate('/create')}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16
          }}
        >
          <AddIcon />
        </Fab>
      )}

      <Dialog
        open={Boolean(selectedTask)}
        onClose={handleCloseDetails}
        maxWidth="md"
        fullWidth
      >
        {selectedTask && (
          <TaskDetails
            task={selectedTask}
            onClose={handleCloseDetails}
          />
        )}
      </Dialog>
    </Box>
  );
};

export default TaskList;
