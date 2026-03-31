import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    topbar: { main: string };
  }
  interface PaletteOptions {
    topbar?: { main: string };
  }
}

export const TOPBAR_BG = '#263238';
export const PRIMARY = '#00a99d';

const theme = createTheme({
  palette: {
    primary: {
      main: PRIMARY,
      dark: '#009688',
      light: '#33c5bb',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F5F7F9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1A2332',
      secondary: '#637381',
    },
    divider: '#E8ECEF',
    topbar: { main: TOPBAR_BG },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    // IBM Plex Mono used for data values, codes, quantities via sx overrides
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
        outlinedPrimary: {
          borderWidth: 1.5,
          '&:hover': { borderWidth: 1.5 },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            fontWeight: 600,
            fontSize: '0.8125rem',
            color: 'text.primary',
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
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#F9FAFB' },
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
          padding: '8px 16px',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          '& fieldset': { borderColor: '#DDE1E6' },
        },
        input: { padding: '9px 14px' },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: '0.875rem' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 10 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 4, fontWeight: 500 },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 5,
          margin: '1px 6px',
          padding: '7px 10px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(0, 150, 136, 0.08)',
            color: PRIMARY,
            '& .MuiListItemIcon-root': { color: PRIMARY },
            '& .MuiListItemText-primary': { color: PRIMARY, fontWeight: 600 },
            '&:hover': { backgroundColor: 'rgba(0, 150, 136, 0.12)' },
          },
          '&:hover': { backgroundColor: 'rgba(0,0,0,0.04)' },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: { minWidth: 28, color: '#637381' },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: { fontSize: '0.8125rem', fontWeight: 500 },
      },
    },
  },
});

export default theme;
