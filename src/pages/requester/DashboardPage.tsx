import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import ButtonBase from '@mui/material/ButtonBase';
import Button from '@mui/material/Button';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { useWorkflowStore } from '../../stores/workflowStore';
import { PRIMARY } from '../../theme';

export default function DashboardPage() {
  const navigate = useNavigate();
  const activeWorkflow = useWorkflowStore((s) => s.activeWorkflow);

  const assignment   = activeWorkflow?.assignmentStrategy === 'request-based' ? 'Request Based' : 'On Route';
  const confirmation = activeWorkflow?.confirmationMode === 'auto' ? 'Auto' : 'Manual';

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', scrollbarGutter: 'stable', display: 'flex', flexDirection: 'column' }}>

      <Box sx={{ px: 2.5, py: 1, display: 'flex', alignItems: 'center', gap: 0.75, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <AccountTreeOutlinedIcon sx={{ fontSize: 14, color: '#9EA8B3' }} />
        <Typography sx={{ fontSize: '0.8125rem', color: '#637381' }}>Workflow</Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: '#C4CDD5' }}>/</Typography>
        <Typography sx={{ fontSize: '0.8125rem', color: PRIMARY, fontWeight: 600 }}>
          {activeWorkflow?.name ?? '—'}
        </Typography>
      </Box>

      <Box sx={{ flex: 1, px: 2, py: 2, display: 'flex', flexDirection: 'column', gap: 1.75, minHeight: 0 }}>

        <Paper
          variant="outlined"
          sx={{
            borderRadius: 3,
            bgcolor: `${PRIMARY}0A`,
            borderColor: `${PRIMARY}22`,
            flex: 1, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            py: 4, px: 3, gap: 2,
          }}
        >
          <Box sx={{ width: 72, height: 72, borderRadius: '18px', bgcolor: PRIMARY, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${PRIMARY}40` }}>
            <WidgetsOutlinedIcon sx={{ fontSize: 36, color: '#fff' }} />
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.375rem', mb: 0.625, color: '#1A2332' }}>Order Material</Typography>
            <Typography sx={{ color: '#637381', fontSize: '0.875rem', lineHeight: 1.65 }}>
              Browse available Sub-SKU types, set quantities,<br />and submit a material request
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap', justifyContent: 'center' }}>
            {['1. Browse', '2. Quantity', '3. Submit'].map((s) => (
              <Chip key={s} label={s} variant="outlined" size="small" sx={{ fontSize: '0.75rem', borderColor: '#CBD5E1', color: '#637381', fontWeight: 500, height: 26 }} />
            ))}
          </Box>
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/history/create')}
            sx={{ px: 4, py: 1.25, fontSize: '0.9375rem', fontWeight: 700, borderRadius: 2, mt: 0.5, minWidth: 200 }}
          >
            Start Ordering
          </Button>
        </Paper>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography sx={{ color: '#9EA8B3', fontSize: '0.8125rem' }}>or</Typography>
        </Box>

        <Paper variant="outlined" sx={{ borderRadius: 2, overflow: 'hidden', flexShrink: 0, '&:hover': { borderColor: '#7B1FA2' } }}>
          <ButtonBase
            onClick={() => navigate('/history/return-trolley')}
            focusRipple
            sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 2, px: 2, py: 1.75, textAlign: 'left' }}
          >
            <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: '#7B1FA2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(123,31,162,0.28)' }}>
              <LocalShippingOutlinedIcon sx={{ fontSize: 22, color: '#fff' }} />
            </Box>
            <Box sx={{ flex: 1, textAlign: 'left' }}>
              <Typography sx={{ fontWeight: 700, fontSize: '0.9375rem', color: '#1A2332' }}>Return Trolley</Typography>
              <Typography sx={{ color: '#637381', fontSize: '0.8125rem', mt: 0.125 }}>
                Scan QR code or enter container details manually
              </Typography>
            </Box>
            <ArrowForwardIosIcon sx={{ fontSize: 14, color: '#C4CDD5', flexShrink: 0 }} />
          </ButtonBase>
        </Paper>

        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, pb: 0.5, flexShrink: 0 }}>
          {[
            { label: 'Assignment',   value: assignment },
            { label: 'Confirmation', value: confirmation },
            { label: 'Dispatcher',   value: 'Not required' },
          ].map(({ label, value }) => (
            <Box key={label}>
              <Typography sx={{ fontSize: '0.7rem', color: '#9EA8B3', mb: 0.25 }}>{label}</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1A2332' }}>{value}</Typography>
            </Box>
          ))}
        </Box>

      </Box>
    </Box>
  );
}
