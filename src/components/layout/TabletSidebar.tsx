import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useWorkflowStore } from '../../stores/workflowStore';

export const SIDEBAR_WIDTH = 153;

const requesterNavItems = [
  { label: 'Request History', path: '/history' },
  { label: 'Staging Area', path: '/staging' },
  { label: 'WIP Inventory', path: '/inventory' },
];

const approverNavItems = [
  { label: 'Requests', path: '/approvals' },
  { label: 'Staging Area', path: '/staging' },
  { label: 'WIP Inventory', path: '/inventory' },
];

export default function TabletSidebar({ onClose }: { onClose?: () => void }) {
  const user = useAuthStore((s) => s.user);
  const activeWorkflow = useWorkflowStore((s) => s.activeWorkflow);
  const setActiveWorkflow = useWorkflowStore((s) => s.setActiveWorkflow);
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleNav = (path: string) => {
    navigate(path);
    onClose?.();
  };

  return (
    <Box sx={{
      width: '100%',
      height: '100%',
      bgcolor: '#fff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1A2332', letterSpacing: '-0.01em' }}>Ati</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#00a99d', letterSpacing: '-0.01em' }}> Flow</Typography>
          <Typography sx={{ fontSize: '0.5rem', color: '#8d8d8d', ml: 0.5, lineHeight: 1 }}>v2.0</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#eeeeee' }} />

      {/* Workflow selector */}
      {user.workflows.length > 0 && (
        <Box sx={{ px: 2, pt: 1.25, pb: 1.5 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#9E9E9E', mb: 0.5, fontWeight: 400 }}>Workflow</Typography>
          <Select
            value={activeWorkflow?.id ?? ''}
            size="small"
            IconComponent={KeyboardArrowDownIcon}
            onChange={(e) => {
              const wf = user.workflows.find((w) => w.id === e.target.value);
              if (wf) setActiveWorkflow(wf);
            }}
            sx={{
              width: '100%',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#1A2332',
              bgcolor: '#fff',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dddddd', borderRadius: '8px' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#BDBDBD' },
              '& .MuiSelect-select': { py: '7px', px: '10px' },
              '& .MuiSvgIcon-root': { fontSize: 18, color: '#637381' },
            }}
          >
            {user.workflows.map((wf) => (
              <MenuItem key={wf.id} value={wf.id} sx={{ fontSize: '0.875rem' }}>
                {wf.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}

      <Divider sx={{ borderColor: '#eeeeee' }} />

      {/* Nav items */}
      <Box sx={{ flex: 1, px: 1.5, py: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {(user.role === 'approver' ? approverNavItems : requesterNavItems).map((item) => {
          const active = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Box
              key={item.path}
              onClick={() => handleNav(item.path)}
              sx={{
                px: 1.25,
                py: 0.875,
                borderRadius: '5px',
                cursor: 'pointer',
                bgcolor: active ? 'rgba(0,169,157,0.19)' : 'transparent',
                transition: 'background-color 0.15s',
                '&:hover': { bgcolor: active ? 'rgba(0,169,157,0.19)' : 'rgba(0,0,0,0.04)' },
              }}
            >
              <Typography sx={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: '#1A2332',
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      <Divider sx={{ borderColor: '#eeeeee' }} />

      {/* Bottom section */}
      <Box sx={{ px: 1.5, py: 1.25 }}>
        <Box
          onClick={() => handleNav('/settings')}
          sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.875, cursor: 'pointer', borderRadius: '5px', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
        >
          <SettingsOutlinedIcon sx={{ fontSize: 18, color: '#1A2332', flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontWeight: 500 }}>Setting</Typography>
        </Box>
        <Box
          sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.25, py: 0.875, cursor: 'pointer', borderRadius: '5px', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
        >
          <HelpOutlineIcon sx={{ fontSize: 18, color: '#1A2332', flexShrink: 0 }} />
          <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontWeight: 500 }}>Help</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#eeeeee' }} />

      {/* Profile */}
      <Box
        onClick={() => handleNav('/profile')}
        sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0,0,0,0.03)' } }}
      >
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#00a99d', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}>
          {user.username.charAt(0).toUpperCase()}
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.username}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(26,35,50,0.54)', lineHeight: 1.3 }}>
            {user.role === 'approver' ? 'Approver' : 'Operator'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
