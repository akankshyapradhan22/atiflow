import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { mockRequests } from '../../data/mock';
import { useWorkflowStore } from '../../stores/workflowStore';
import type { Request } from '../../types';

const STATUS_CONFIG: Record<Request['status'], { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: '#F57C00', bg: '#FFF8E1' },
  awaiting_confirmation: { label: 'Awaiting', color: '#1565C0', bg: '#E3F2FD' },
  in_progress: { label: 'In Progress', color: '#00a99d', bg: 'rgba(0,150,136,0.1)' },
  completed: { label: 'Completed', color: '#2E7D32', bg: '#E8F5E9' },
  failed: { label: 'Failed', color: '#C62828', bg: '#FFEBEE' },
  breakdown: { label: 'Breakdown', color: '#6A1B9A', bg: '#F3E5F5' },
};

const TYPE_LABELS: Record<Request['type'], string> = {
  material: 'Material',
  container: 'Container',
  return_trolley: 'Return Trolley',
};

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed', 'Failed'];

export default function MyRequestsPage() {
  const activeWorkflow = useWorkflowStore((s) => s.activeWorkflow);
  const [tabIdx, setTabIdx] = useState(0);

  const workflowRequests = mockRequests.filter((r) => r.workflowId === activeWorkflow?.id);

  const filtered = workflowRequests.filter((r) => {
    if (tabIdx === 0) return true;
    return (
      (tabIdx === 1 && r.status === 'pending') ||
      (tabIdx === 2 && (r.status === 'in_progress' || r.status === 'awaiting_confirmation')) ||
      (tabIdx === 3 && r.status === 'completed') ||
      (tabIdx === 4 && (r.status === 'failed' || r.status === 'breakdown'))
    );
  });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>My Requests</Typography>
        <Typography variant="caption" color="text.secondary">
          {activeWorkflow?.name} · {workflowRequests.length} request{workflowRequests.length !== 1 ? 's' : ''}
        </Typography>
      </Box>

      <Box sx={{ bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <Tabs value={tabIdx} onChange={(_, v) => setTabIdx(v)} sx={{ px: 1.5, minHeight: 42, '& .MuiTabs-indicator': { height: 2 } }}>
          {FILTERS.map((f) => (
            <Tab key={f} label={f} sx={{ fontSize: '0.8rem', minHeight: 42, px: 1.5 }} />
          ))}
        </Tabs>
      </Box>

      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', p: 2 }}>
        {filtered.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">No requests found</Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {filtered.map((req) => {
            const s = STATUS_CONFIG[req.status];
            return (
              <Paper key={req.id} variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
                <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.875rem' }}>{req.id}</Typography>
                      <Chip label={TYPE_LABELS[req.type]} size="small" sx={{ fontSize: '0.7rem', height: 20, bgcolor: '#f0f0f0', color: 'text.secondary' }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary">{req.items}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                    <Chip label={s.label} size="small" sx={{ fontSize: '0.7rem', bgcolor: s.bg, color: s.color, fontWeight: 600 }} />
                    <Typography variant="caption" sx={{ color: 'text.disabled' }}>{req.createdAt}</Typography>
                  </Box>
                </Box>
                <Divider />
                <Box sx={{ px: 2, py: 1, bgcolor: '#F9FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" color="text.secondary">Workflow: <strong>{req.workflow}</strong></Typography>
                  {req.status === 'in_progress' && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#00a99d', animation: 'pulse 1.5s ease-in-out infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.3 } } }} />
                      <Typography variant="caption" sx={{ color: '#00a99d', fontWeight: 600 }}>AMR En Route</Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
