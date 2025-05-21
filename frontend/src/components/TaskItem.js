import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Chip, 
  IconButton, 
  Box,
  Stack,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlagIcon from '@mui/icons-material/Flag';
import CategoryIcon from '@mui/icons-material/Category';

const PRIORITY_COLORS = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'error'
};

const STATUS_COLORS = {
  TODO: 'default',
  IN_PROGRESS: 'primary',
  COMPLETED: 'success'
};

function TaskItem({ task, onDelete, onEdit }) {
  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="h6" component="div">
            {task.title}
          </Typography>
          <Box>
            <Tooltip title="Edit Task">
              <IconButton onClick={() => onEdit(task)} size="small">
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete Task">
              <IconButton onClick={() => onDelete(task.id)} size="small">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Typography color="text.secondary" sx={{ mb: 1.5 }}>
          {task.description}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
          <Chip 
            icon={<CategoryIcon />}
            label={task.category} 
            size="small"
            variant="outlined"
          />
          <Chip 
            icon={<FlagIcon />}
            label={task.priority} 
            color={PRIORITY_COLORS[task.priority]}
            size="small"
          />
          <Chip 
            label={task.status} 
            color={STATUS_COLORS[task.status]}
            size="small"
          />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default TaskItem;
