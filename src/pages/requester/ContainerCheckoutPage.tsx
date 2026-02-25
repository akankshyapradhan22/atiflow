import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import { useCartStore } from '../../stores/cartStore';
import { useWorkflowStore } from '../../stores/workflowStore';
import { PRIMARY } from '../../theme';

const TYPE_LABELS: Record<string, string> = { trolley: 'Trolley', pallet: 'Pallet', bin: 'Bin' };

export default function ContainerCheckoutPage() {
  const navigate = useNavigate();
  const containerCart = useCartStore((s) => s.containerCart);
  const clearContainerCart = useCartStore((s) => s.clearContainerCart);
  const activeWorkflow = useWorkflowStore((s) => s.activeWorkflow);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, gap: 3 }}>
        <Box sx={{ width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(21,101,192,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircleIcon sx={{ fontSize: 44, color: '#1565C0' }} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>Container Request Submitted!</Typography>
          <Typography variant="body2" color="text.secondary">
            Your container request has been created. A robot will be dispatched shortly.
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate('/history')}>View My Requests</Button>
          <Button variant="contained" onClick={() => { clearContainerCart(); navigate('/history'); }}>Back to Home</Button>
        </Box>
      </Box>
    );
  }

  if (containerCart.length === 0) {
    return (
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 4, gap: 2 }}>
        <Typography variant="body2" color="text.secondary">No containers selected.</Typography>
        <Button variant="contained" onClick={() => navigate('/history/container')}>Select Containers</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <IconButton size="small" onClick={() => navigate(-1)} sx={{ color: 'text.secondary' }}>
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>Container Order Review</Typography>
          <Typography variant="caption" color="text.secondary">{activeWorkflow?.name}</Typography>
        </Box>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', scrollbarGutter: 'stable', p: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
          <Box sx={{ px: 2, py: 1.5, bgcolor: '#f7f7f7', borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>
              Container Order ({containerCart.length} item{containerCart.length !== 1 ? 's' : ''})
            </Typography>
          </Box>
          {containerCart.map((item, idx) => (
            <Box key={item.subtypeId}>
              {idx > 0 && <Divider />}
              <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: 'rgba(21,101,192,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0' }}>
                  <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.subtypeName}</Typography>
                  <Typography variant="caption" color="text.secondary">{TYPE_LABELS[item.containerType]} · Qty: {item.quantity}</Typography>
                </Box>
                <IconButton size="small" onClick={() => clearContainerCart()} sx={{ color: '#E53935' }}>
                  <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            </Box>
          ))}
        </Paper>
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
        <Button variant="contained" fullWidth size="large" onClick={() => setConfirmOpen(true)}
          sx={{ py: 1.5, fontWeight: 700, fontSize: '1rem', borderRadius: 1.5 }}>
          Submit Container Request
        </Button>
      </Box>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="xs" fullWidth>
        <Box sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Confirm Container Order</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Submit container order for <strong>{activeWorkflow?.name}</strong>?
          </Typography>
        </Box>
        <DialogContent sx={{ pt: 1 }}>
          {containerCart.map((item) => (
            <Box key={item.subtypeId} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.5 }}>
              <Typography variant="body2">{item.subtypeName}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>×{item.quantity}</Typography>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5, gap: 1 }}>
          <Button onClick={() => setConfirmOpen(false)} color="inherit" sx={{ flex: 1 }}>Cancel</Button>
          <Button variant="contained" sx={{ flex: 1 }} onClick={() => { setConfirmOpen(false); setSubmitted(true); }}>
            Confirm & Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// suppress unused import warning
void PRIMARY;
