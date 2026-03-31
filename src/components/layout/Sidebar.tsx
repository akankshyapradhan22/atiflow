import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import TabletMacOutlinedIcon from '@mui/icons-material/TabletMacOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import { mockProcessingAreas } from '../../data/mock';
import { PRIMARY } from '../../theme';

export const SIDEBAR_WIDTH = 220;

const NAV_ITEMS = [
  { label: 'Execution Source Config', path: '/execution-source', icon: <TabletMacOutlinedIcon sx={{ fontSize: 20 }} /> },
  { label: 'Settings',                path: '/settings',          icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} /> },
];

interface SidebarProps {
  onCreateArea?: () => void;
}

export default function Sidebar({ onCreateArea }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [paOpen, setPaOpen] = useState(true);

  const isActive        = (path: string)   => pathname === path || pathname.startsWith(path + '/');
  const isAreaActive    = (areaId: string) => pathname === `/area/${areaId}` || pathname.startsWith(`/area/${areaId}/`);
  const isHomeActive    = pathname === '/';

  const navItemSx = (active: boolean) => ({
    mx: 0.75,
    mb: 0.25,
    borderRadius: '5px',
    py: 0.875,
    px: 1.25,
    gap: 0.5,
    bgcolor: active ? 'rgba(0,169,157,0.19)' : 'transparent',
    '&:hover': { bgcolor: active ? 'rgba(0,169,157,0.19)' : 'rgba(0,0,0,0.04)' },
  });

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: '100%',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Logo ──────────────────────────────────────── */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1A2332', letterSpacing: '-0.01em' }}>Ati</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#00a99d', letterSpacing: '-0.01em' }}> Flow</Typography>
          <Typography sx={{ fontSize: '0.5rem', color: '#8d8d8d', ml: 0.5, lineHeight: 1 }}>v2.0</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#eeeeee' }} />

      {/* ── Top nav items ─────────────────────────────── */}
      <List disablePadding dense sx={{ pt: 0.75 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              disableRipple
              sx={navItemSx(active)}
            >
              <ListItemIcon sx={{ minWidth: 30, color: active ? PRIMARY : '#637381' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? PRIMARY : '#1a2332',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#eeeeee', my: 0.5 }} />

      {/* ── Processing Areas ───────────────────────────── */}
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <ListItemButton
          onClick={() => setPaOpen((o) => !o)}
          disableRipple
          sx={{ mx: 0.875, borderRadius: '6px', py: 0.75, px: 1.25, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
        >
          <ListItemText
            primary="Processing Areas"
            primaryTypographyProps={{ fontSize: '0.75rem', fontWeight: 600, color: '#1a2332', letterSpacing: '0.01em' }}
          />
          {paOpen
            ? <ExpandMoreIcon sx={{ fontSize: 16, color: '#637381' }} />
            : <ChevronRightIcon sx={{ fontSize: 16, color: '#637381' }} />}
        </ListItemButton>

        <Collapse in={paOpen} timeout="auto">
          <List disablePadding dense>
            {mockProcessingAreas.map((area) => {
              const active = isAreaActive(area.id);
              return (
                <ListItemButton
                  key={area.id}
                  onClick={() => navigate(`/area/${area.id}`)}
                  disableRipple
                  sx={{
                    ...navItemSx(active),
                    '& .more-btn': { opacity: 0 },
                    '&:hover .more-btn': { opacity: 1 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 30, color: active ? PRIMARY : '#637381' }}>
                    <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={area.name}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? PRIMARY : '#1a2332',
                    }}
                  />
                  <IconButton
                    size="small"
                    className="more-btn"
                    sx={{ p: 0.25, color: '#637381', flexShrink: 0 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </ListItemButton>
              );
            })}

            {/* Create New Area */}
            <ListItemButton
              onClick={() => { navigate('/'); onCreateArea?.(); }}
              disableRipple
              sx={{
                mx: 0.875, mb: 0.25, borderRadius: '6px', py: 0.75, px: 1.25, gap: 0.5,
                bgcolor: isHomeActive ? 'rgba(0,169,157,0.19)' : 'transparent',
                '&:hover': { bgcolor: isHomeActive ? 'rgba(0,169,157,0.19)' : 'rgba(0,0,0,0.04)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: isHomeActive ? PRIMARY : '#637381' }}>
                <AddCircleOutlineIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Create New Area"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isHomeActive ? 600 : 400,
                  color: isHomeActive ? PRIMARY : '#637381',
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </Box>

      <Divider sx={{ borderColor: '#eeeeee' }} />

      {/* ── User profile ────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#00a99d', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}>
          A
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Allu Arjun
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(26,35,50,0.54)', lineHeight: 1.3 }}>
            Jhukega Nahi
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
