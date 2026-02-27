import { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet } from 'react-router-dom';
import { useMediaQuery, useTheme } from '@mui/material';
import TabletSidebar, { SIDEBAR_WIDTH } from './TabletSidebar';

export default function TabletLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{
      display: 'flex',
      height: '100%',
      overflow: 'hidden',
      bgcolor: '#e9e9e9',
      p: 1.5,
      gap: 1.5,
      boxSizing: 'border-box',
    }}>
      {/* Permanent sidebar card for md+ */}
      {!isMobile && (
        <Box sx={{
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          height: '100%',
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          overflow: 'hidden',
          bgcolor: '#fff',
        }}>
          <TabletSidebar />
        </Box>
      )}

      {/* Temporary drawer for mobile */}
      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: SIDEBAR_WIDTH,
              boxSizing: 'border-box',
              height: '100vh',
            },
            '@supports (height: 100dvh)': {
              '& .MuiDrawer-paper': { height: '100dvh' },
            },
          }}
        >
          <TabletSidebar onClose={() => setMobileOpen(false)} />
        </Drawer>
      )}

      {/* Main content card */}
      <Box
        component="main"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
          border: '1px solid #e0e0e0',
          borderRadius: '10px',
          bgcolor: '#fff',
        }}
      >
        {/* Mobile top bar */}
        {isMobile && (
          <Box sx={{ px: 1, py: 0.5, bgcolor: '#fff', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <IconButton onClick={() => setMobileOpen(true)} size="small">
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* Page content fills the card */}
        <Box sx={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
