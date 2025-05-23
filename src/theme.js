import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
      lighter: 'rgba(33, 150, 243, 0.08)'
    },
    secondary: {
      main: '#f50057',
      light: '#ff4081',
      dark: '#c51162',
      lighter: 'rgba(245, 0, 87, 0.08)'
    },
    error: {
      main: '#f44336',
      light: '#e57373',
      dark: '#d32f2f',
      lighter: 'rgba(244, 67, 54, 0.08)'
    },
    warning: {
      main: '#ff9800',
      light: '#ffb74d',
      dark: '#f57c00',
      lighter: 'rgba(255, 152, 0, 0.08)'
    },
    info: {
      main: '#00bcd4',
      light: '#4dd0e1',
      dark: '#0097a7',
      lighter: 'rgba(0, 188, 212, 0.08)'
    },
    success: {
      main: '#4caf50',
      light: '#81c784',
      dark: '#388e3c',
      lighter: 'rgba(76, 175, 80, 0.08)'
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff'
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    },
    button: {
      textTransform: 'none',
      fontWeight: 500
    }
  },
  shape: {
    borderRadius: 8
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-1px)'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          transition: 'all 0.2s ease-in-out'
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          transition: 'all 0.2s ease-in-out'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12
        }
      }
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: 16
        }
      }
    }
  }
});

export default theme; 