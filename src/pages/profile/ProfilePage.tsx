import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuthStore } from '../../stores/authStore';
import { useWorkflowStore } from '../../stores/workflowStore';
import { useCartStore } from '../../stores/cartStore';

export default function ProfilePage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const setActiveWorkflow = useWorkflowStore((s) => s.setActiveWorkflow);
  const clearAll = useCartStore((s) => s.clearAll);

  const [name, setName] = useState(user?.username ?? '');
  const [designation, setDesignation] = useState(user?.username ?? '');

  const handleLogout = () => {
    logout();
    setActiveWorkflow(null);
    clearAll();
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', px: 3, pt: 2.5, pb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1A2332', mb: 3 }}>
            Profile
          </Typography>

          <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {/* Avatar section */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
              <Avatar sx={{
                width: 120, height: 120,
                bgcolor: '#00a99d',
                fontSize: '2.5rem',
                fontWeight: 700,
              }}>
                {(user?.username ?? 'A').charAt(0).toUpperCase()}
              </Avatar>
              <Link href="#" underline="hover" sx={{ fontSize: '0.875rem', color: '#637381' }}>
                Change profile picture
              </Link>
            </Box>

            {/* Form fields */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, flex: 1, minWidth: 200, maxWidth: 340 }}>
              <Box>
                <Typography sx={{ fontSize: '0.875rem', color: '#637381', mb: 0.75 }}>Name</Typography>
                <TextField
                  fullWidth
                  value={name}
                  onChange={e => setName(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
              </Box>

              <Box>
                <Typography sx={{ fontSize: '0.875rem', color: '#637381', mb: 0.75 }}>Designation</Typography>
                <TextField
                  fullWidth
                  value={designation}
                  onChange={e => setDesignation(e.target.value)}
                  size="small"
                  sx={fieldSx}
                />
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider />
        <Box sx={{ px: 3, py: 2 }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{ borderRadius: 1.5, fontWeight: 600 }}
          >
            Sign Out
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

const fieldSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: '#E0E0E0', borderRadius: 1.5 },
    '&:hover fieldset': { borderColor: '#BDBDBD' },
    '&.Mui-focused fieldset': { borderColor: '#00a99d' },
  },
  '& .MuiOutlinedInput-input': { py: '11px', px: '14px', fontSize: '0.9375rem' },
};
