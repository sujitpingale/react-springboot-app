import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  Category as CategoryIcon,
  Event as EventIcon
} from '@mui/icons-material';

const priorityColors = {
  LOW: 'success',
  MEDIUM: 'info',
  HIGH: 'warning',
  URGENT: 'error'
};

const priorityLabels = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent'
};

const TaskItem = ({ task, onUpdate, onDelete, onClick, onEdit }) => {
  const handleStatusChange = async (newStatus) => {
    try {
      await onUpdate(task.id, { ...task, status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(task.id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          boxShadow: 6
        }
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {task.title}
          </Typography>
          <Box>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete();
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {task.description}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip
            label={task.status}
            color={task.status === 'COMPLETED' ? 'success' : 'primary'}
            size="small"
          />
          <Chip
            icon={<FlagIcon />}
            label={priorityLabels[task.priority]}
            color={priorityColors[task.priority]}
            size="small"
          />
          <Chip
            icon={<CategoryIcon />}
            label={task.category}
            variant="outlined"
            size="small"
          />
          {task.dueDate && (
            <Chip
              icon={<EventIcon />}
              label={new Date(task.dueDate).toLocaleDateString()}
              variant="outlined"
              size="small"
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
