import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { TOPBAR_BG, PRIMARY } from '../../theme';

export default function TopBar() {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: TOPBAR_BG,
        zIndex: (t) => t.zIndex.drawer + 1,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <Toolbar variant="dense" sx={{ minHeight: 48, px: 1.5 }}>
        {/* Logo + App name */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, flexGrow: 1 }}>
          <Box
            sx={{
              width: 28,
              height: 28,
              borderRadius: 1,
              backgroundColor: 'rgba(0,150,136,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Typography
              sx={{
                color: PRIMARY,
                fontWeight: 700,
                fontSize: '0.7rem',
                lineHeight: 1,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Ati
            </Typography>
          </Box>
          <Chip
            label="v2.0"
            size="small"
            sx={{
              height: 16,
              fontSize: '0.6rem',
              fontWeight: 700,
              backgroundColor: 'rgba(0,150,136,0.25)',
              color: '#4DB6AC',
              '& .MuiChip-label': { px: 0.625 },
            }}
          />
          <Typography
            sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, fontSize: '0.8125rem', lineHeight: 1.5, ml: 0.25 }}
          >
            Material Tracking System
          </Typography>
        </Box>

        {/* Avatar */}
        <Avatar
          sx={{
            width: 28,
            height: 28,
            bgcolor: PRIMARY,
            fontSize: '0.8rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          A
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
