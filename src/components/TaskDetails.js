import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  TextField,
  Button,
  Divider,
  Chip,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Link as LinkIcon,
  SubdirectoryArrowRight as SubtaskIcon
} from '@mui/icons-material';
import axios from 'axios';
import TaskDependencies from './TaskDependencies';

const TaskDetails = ({ task, onClose }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [comments, setComments] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      fetchComments();
      fetchAttachments();
    }
  }, [task, fetchComments, fetchAttachments]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/${task.id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments');
    }
  };

  const fetchAttachments = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/tasks/${task.id}/attachments`);
      setAttachments(response.data);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      setError('Failed to load attachments');
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await axios.post(`http://localhost:8080/api/tasks/${task.id}/comments`, {
        content: newComment
      });
      setNewComment('');
      fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      await axios.post(`http://localhost:8080/api/tasks/${task.id}/attachments`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchAttachments();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAttachment = async (attachmentId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/attachments/${attachmentId}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1]);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      setError('Failed to download file');
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await axios.delete(`http://localhost:8080/api/attachments/${attachmentId}`);
      fetchAttachments();
    } catch (error) {
      console.error('Error deleting attachment:', error);
      setError('Failed to delete attachment');
    }
  };

  return (
    <Paper sx={{ p: 3, maxHeight: '80vh', overflow: 'auto' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Details" />
          <Tab label="Dependencies" />
          <Tab label="Comments" />
          <Tab label="Attachments" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {activeTab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {task.title}
          </Typography>
          <Typography variant="body1" paragraph>
            {task.description}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Chip
                label={task.status}
                color={task.status === 'COMPLETED' ? 'success' : 'primary'}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Priority
              </Typography>
              <Chip
                label={task.priority}
                color={task.priority === 'HIGH' ? 'error' : 'default'}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Category
              </Typography>
              <Chip label={task.category} variant="outlined" size="small" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="text.secondary">
                Due Date
              </Typography>
              <Typography variant="body2">
                {new Date(task.dueDate).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}

      {activeTab === 1 && (
        <TaskDependencies task={task} />
      )}

      {activeTab === 2 && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              variant="outlined"
              size="small"
            />
            <Button
              variant="contained"
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              sx={{ mt: 1 }}
            >
              Add Comment
            </Button>
          </Box>
          <List>
            {comments.map((comment) => (
              <React.Fragment key={comment.id}>
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{comment.userName?.[0]}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={comment.userName}
                    secondary={
                      <>
                        <Typography component="span" variant="body2" color="text.primary">
                          {comment.content}
                        </Typography>
                        <br />
                        {new Date(comment.createdAt).toLocaleString()}
                      </>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}

      {activeTab === 3 && (
        <Box>
          <Box sx={{ mb: 2 }}>
            <input
              type="file"
              id="file-upload"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload">
              <Button
                variant="contained"
                component="span"
                startIcon={<AttachFileIcon />}
                disabled={loading}
              >
                Upload File
              </Button>
            </label>
          </Box>
          <List>
            {attachments.map((attachment) => (
              <ListItem
                key={attachment.id}
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      onClick={() => handleDownloadAttachment(attachment.id)}
                    >
                      <DownloadIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteAttachment(attachment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <AttachFileIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={attachment.fileName}
                  secondary={`${(attachment.fileSize / 1024).toFixed(2)} KB`}
                />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default TaskDetails; 