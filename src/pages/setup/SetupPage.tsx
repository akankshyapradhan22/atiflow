import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { TOPBAR_BG } from '../../theme';
import atiLogo from '../../assets/ati-logo.png';

const SETUP_KEY = 'mts_setup_complete';


function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = () => {
    if (username.trim() === 'PA01' && password.trim() === '1234') {
      onAuth();
    } else {
      setError(true);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: TOPBAR_BG, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Toolbar variant="dense" sx={{ minHeight: 56 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box component="img" src={atiLogo} alt="Ati" sx={{ height: 26, width: 'auto', objectFit: 'contain' }} />
            <Chip label="v2.0" size="small" sx={{ height: 18, fontSize: '0.65rem', fontWeight: 700, backgroundColor: 'rgba(0,150,136,0.25)', color: '#4DB6AC', '& .MuiChip-label': { px: 0.75 } }} />
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, ml: 0.5 }}>
              Material Tracking System
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
        <Card sx={{ maxWidth: 400, width: '100%', borderRadius: 2.5, p: 1 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Admin Login</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>Sign in to access the admin dashboard</Typography>
            <TextField
              fullWidth label="Username" value={username} size="small" sx={{ mb: 2 }}
              onChange={(e) => { setUsername(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              error={error}
            />
            <TextField
              fullWidth label="Password" type="password" value={password} size="small" sx={{ mb: error ? 1 : 3 }}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              error={error}
            />
            {error && <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mb: 2 }}>Invalid username or password</Typography>}
            <Button variant="contained" fullWidth size="large" onClick={handleSubmit}>Sign In</Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default function SetupPage() {
  const navigate = useNavigate();

  const handleAuth = () => {
    localStorage.setItem(SETUP_KEY, 'true');
    navigate('/');
  };

  return <LoginGate onAuth={handleAuth} />;
}
