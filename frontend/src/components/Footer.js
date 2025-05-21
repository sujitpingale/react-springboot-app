import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[900],
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%'
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © {currentYear} Task Management System. All rights reserved.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Made with ❤️ by{' '}
        <Link color="inherit" href="https://github.com/yourusername">
          Your Name
        </Link>
      </Typography>
    </Box>
  );
}

export default Footer; 