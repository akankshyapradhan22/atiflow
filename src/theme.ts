import { createTheme } from '@mui/material/styles';

export const PRIMARY = '#00a99d';

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      dark: '#00897b',
      light: '#4db6ac',
      contrastText: '#ffffff',
    },
    background: {
      default: '#e9e9e9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1A2332',
      secondary: '#637381',
    },
    divider: '#E8ECEF',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    subtitle2: { fontWeight: 600 },
    body2: { fontSize: '0.8125rem' },
    caption: { fontSize: '0.75rem', color: '#637381' },
  },
  shape: { borderRadius: 6 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#e9e9e9', overscrollBehavior: 'none' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          letterSpacing: '0.02em',
          borderRadius: 6,
          minHeight: 44,
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': { boxShadow: 'none' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.9375rem',
          '& fieldset': { borderColor: '#DDE1E6' },
        },
        input: { padding: '12px 14px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.9375rem' },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 500 },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.8125rem',
            backgroundColor: '#F8F9FA',
            borderBottom: '2px solid #E8ECEF',
            padding: '10px 16px',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #F0F3F5',
          padding: '10px 16px',
          fontSize: '0.8125rem',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.875rem',
          minHeight: 44,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 10 },
      },
    },
  },
});

export default theme;
