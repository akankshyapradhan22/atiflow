import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import emptyStateImg from '../../assets/empty-state.png';
import CreateAreaDialog from './CreateAreaDialog';
import { PRIMARY } from '../../theme';

export default function HomePage() {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = (name: string, _machine: string, _point: string) => {
    setDialogOpen(false);
    // Navigate to the newly created area
    const id = name.toLowerCase().replace(/\s+/g, '-');
    navigate(`/area/${id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Breadcrumb */}
      <Box sx={{ px: 3, py: 2, borderBottom: '1px solid #f0f0f0', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 0.75 }}>
        <Typography sx={{ fontSize: '0.8125rem', color: '#637381', fontWeight: 500 }}>
          Processing Area
        </Typography>
        <ChevronRightIcon sx={{ fontSize: 14, color: '#9EA8B3' }} />
        <Typography sx={{ fontSize: '0.8125rem', color: '#1a2332', fontWeight: 600 }}>
          Create New Area
        </Typography>
      </Box>

      {/* Empty state content */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#F5F7F9',
        gap: 2.5,
      }}>
        <img src={emptyStateImg} alt="No processing areas" style={{ width: 280, height: 'auto' }} />

        <Typography sx={{
          fontSize: '0.9rem',
          color: '#637381',
          textAlign: 'center',
          maxWidth: 320,
          lineHeight: 1.6,
          fontStyle: 'italic',
        }}>
          "Looks like there's nothing here right now. Set up a processing area to get started!"
        </Typography>

        <Button
          variant="outlined"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => setDialogOpen(true)}
          sx={{
            borderColor: PRIMARY,
            color: PRIMARY,
            fontWeight: 500,
            fontSize: '0.875rem',
            textTransform: 'none',
            borderRadius: '6px',
            px: 2.5,
            py: 0.875,
            '&:hover': { bgcolor: `${PRIMARY}0d`, borderColor: PRIMARY },
          }}
        >
          Create New Area
        </Button>
      </Box>

      <CreateAreaDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}
