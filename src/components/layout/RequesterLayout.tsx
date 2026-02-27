import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import BottomNav, { BOTTOM_NAV_HEIGHT } from './BottomNav';

export default function RequesterLayout() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box
        sx={{
          pb: `${BOTTOM_NAV_HEIGHT}px`,
          flex: 1,
          minHeight: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
      <BottomNav />
    </Box>
  );
}
