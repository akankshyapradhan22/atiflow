import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Divider from '@mui/material/Divider';
import OutlinedInput from '@mui/material/OutlinedInput';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { useAuthStore } from '../../stores/authStore';
import { useWorkflowStore } from '../../stores/workflowStore';

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const setActiveWorkflow = useWorkflowStore((s) => s.setActiveWorkflow);

  const [stationId, setStationId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const ok = login(stationId, password);
    if (ok) {
      const user = useAuthStore.getState().user;
      if (user?.workflows[0]) setActiveWorkflow(user.workflows[0]);
      navigate('/history', { replace: true });
    } else {
      setError('Invalid Station ID or password. (Hint: PA01 / 1234)');
    }
  };

  return (
    <Box sx={{
      height: '100%',
      width: '100%',
      bgcolor: '#e9e9e9',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      {/* Login card */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'row',
        width: 684,
        maxWidth: '95vw',
        bgcolor: '#fff',
        border: '1px solid #cfcfcf',
        borderRadius: '10px',
        overflow: 'hidden',
      }}>

        {/* ── Left panel ── */}
        <Box sx={{
          width: 249,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: 3.5,
          py: 4,
          borderRight: '1px solid #e0e0e0',
        }}>
          {/* AtiFlow logo */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{
              fontWeight: 700,
              fontSize: '1.375rem',
              color: '#1A2332',
              lineHeight: 1,
              letterSpacing: '-0.01em',
            }}>
              Ati
            </Typography>
            <Typography sx={{
              fontWeight: 700,
              fontSize: '3.625rem',
              color: '#00a99d',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
            }}>
              Flow
            </Typography>
          </Box>

          <Divider sx={{ borderColor: '#e0e0e0', mb: 3 }} />

          {/* Requester Tablet label */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <ArticleOutlinedIcon sx={{ fontSize: 52, color: '#637381', flexShrink: 0 }} />
            <Typography sx={{
              fontWeight: 600,
              fontSize: '1.375rem',
              color: '#1A2332',
              lineHeight: 1.3,
            }}>
              Requester<br />Tablet
            </Typography>
          </Box>
        </Box>

        {/* ── Right panel (form) ── */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            px: '45px',
            pt: '25px',
            pb: '18px',
          }}
        >
          {/* Heading */}
          <Typography sx={{ fontWeight: 600, fontSize: '1.5rem', color: '#1A2332', mb: '6px' }}>
            Sign in
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.48)', mb: '28px' }}>
            Enter your credentials to access this station
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, py: 0.25, fontSize: '0.8125rem' }}>
              {error}
            </Alert>
          )}

          {/* Fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Station ID */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: '#1A2332' }}>
                Station ID
              </Typography>
              <OutlinedInput
                value={stationId}
                onChange={(e) => setStationId(e.target.value)}
                placeholder="e.g. PA01"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e as unknown as React.FormEvent)}
                sx={fieldSx}
              />
            </Box>

            {/* Password */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: '#1A2332' }}>
                Password
              </Typography>
              <OutlinedInput
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                sx={fieldSx}
              />
            </Box>
          </Box>

          {/* Sign in button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: '28px',
              bgcolor: '#00a99d',
              '&:hover': { bgcolor: '#00897b', boxShadow: 'none' },
              fontWeight: 600,
              fontSize: '1rem',
              borderRadius: '8px',
              py: '10px',
              textTransform: 'none',
              boxShadow: 'none',
            }}
          >
            Sign in
          </Button>

          <Box sx={{ flex: 1 }} />

          <Divider sx={{ borderColor: '#e0e0e0', mb: '15px' }} />

          {/* Footer row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.48)' }}>
              Device: YOHT-123
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.48)' }}>
              Need help?
            </Typography>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}

const fieldSx = {
  height: 44,
  bgcolor: '#f1f1f1',
  borderRadius: '8px',
  fontSize: '0.9375rem',
  color: '#1A2332',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#bdbdbd' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00a99d', borderWidth: '1.5px' },
  '& input::placeholder': { color: 'rgba(26,35,50,0.35)', fontSize: '0.875rem' },
};
