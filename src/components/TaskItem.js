import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const statusColors = {
  TODO: 'warning',
  IN_PROGRESS: 'info',
  COMPLETED: 'success'
};

const statusLabels = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed'
};

const TaskItem = ({ task, onDelete, onEdit }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[2],
          borderColor: 'primary.main'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              fontWeight: 600,
              color: 'text.primary',
              mb: 1
            }}
          >
            {task.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Edit Task">
              <IconButton 
                onClick={handleEdit}
                size="small"
                sx={{ 
                  color: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.lighter'
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton 
                onClick={handleDelete}
                size="small"
                sx={{ 
                  color: 'error.main',
                  '&:hover': {
                    backgroundColor: 'error.lighter'
                  }
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
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {task.description}
        </Typography>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 1
        }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label={statusLabels[task.status]}
              color={statusColors[task.status]}
              size="small"
              sx={{ 
                borderRadius: 1,
                fontWeight: 500
              }}
            />
            <Chip
              label={`Due: ${formatDate(task.dueDate)}`}
              variant="outlined"
              size="small"
              sx={{ 
                borderRadius: 1,
                fontWeight: 500
              }}
            />
          </Box>
          {!isMobile && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                fontStyle: 'italic'
              }}
            >
              Created by {task.userName || 'Unknown'}
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
