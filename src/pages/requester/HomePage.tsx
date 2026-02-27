import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import InputBase from '@mui/material/InputBase';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SyncOutlinedIcon from '@mui/icons-material/SyncOutlined';
import ScheduleOutlinedIcon from '@mui/icons-material/ScheduleOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { useWorkflowStore } from '../../stores/workflowStore';
import { mockRequests } from '../../data/mock';
import type { Request } from '../../types';

const GRID_COLS = '140px 1fr 155px 110px';

function getAccentColor(status: Request['status']): string {
  switch (status) {
    case 'in_progress':           return 'rgba(0,150,136,0.28)';
    case 'awaiting_confirmation': return 'rgba(21,101,192,0.25)';
    case 'pending':               return 'rgba(245,124,0,0.28)';
    case 'completed':             return 'rgba(46,125,50,0.28)';
    case 'failed':                return 'rgba(198,40,40,0.28)';
    case 'breakdown':             return 'rgba(106,27,154,0.28)';
    default:                      return 'rgba(0,0,0,0.08)';
  }
}

function StatusBadge({ status }: { status: Request['status'] }) {
  const styles: Record<string, { label: string; bg: string; border: string }> = {
    completed:             { label: 'Completed',   bg: '#E8F5E9',               border: 'rgba(46,125,50,0.45)' },
    in_progress:           { label: 'In Progress', bg: 'rgba(0,150,136,0.1)',   border: 'rgba(0,150,136,0.45)' },
    pending:               { label: 'Pending',     bg: '#FFF8E1',               border: 'rgba(245,124,0,0.45)' },
    awaiting_confirmation: { label: 'Awaiting',    bg: '#E3F2FD',               border: 'rgba(21,101,192,0.45)' },
    failed:                { label: 'Failed',      bg: '#FFEBEE',               border: 'rgba(198,40,40,0.45)' },
    breakdown:             { label: 'Breakdown',   bg: '#F3E5F5',               border: 'rgba(106,27,154,0.45)' },
  };
  const s = styles[status] ?? styles.completed;
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      px: 1.25, py: '3px',
      bgcolor: s.bg, border: `1px solid ${s.border}`, borderRadius: '22px',
    }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#1A2332' }}>{s.label}</Typography>
    </Box>
  );
}

function TypeBadge({ type }: { type: Request['type'] }) {
  const labels: Record<string, string> = {
    material:      'Fulfillment',
    container:     'Container',
    return_trolley: 'Return',
  };
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center',
      px: '5px', py: '1px',
      bgcolor: 'rgba(173,173,173,0.13)', border: '1px solid rgba(197,197,197,0.64)', borderRadius: '6px',
    }}>
      <Typography sx={{ fontSize: '0.625rem', color: 'rgba(26,35,50,0.68)', fontWeight: 400 }}>
        {labels[type] ?? type}
      </Typography>
    </Box>
  );
}

const statConfigs = [
  {
    key: 'inprogress',
    label: 'In Progress',
    sublabel: 'Active right now',
    icon: SyncOutlinedIcon,
    iconBg: 'rgba(0,169,157,0.12)',
    iconColor: '#009688',
    accentColor: '#009688',
  },
  {
    key: 'pending',
    label: 'Pending',
    sublabel: 'Awaiting dispatch',
    icon: ScheduleOutlinedIcon,
    iconBg: 'rgba(255,167,25,0.12)',
    iconColor: '#ffa719',
    accentColor: '#ffa719',
  },
  {
    key: 'completed',
    label: 'Completed',
    sublabel: 'Done today',
    icon: TaskAltOutlinedIcon,
    iconBg: 'rgba(46,125,50,0.1)',
    iconColor: '#2E7D32',
    accentColor: '#2E7D32',
  },
  {
    key: 'failed',
    label: 'Failed',
    sublabel: 'Need attention',
    icon: ErrorOutlineOutlinedIcon,
    iconBg: 'rgba(198,40,40,0.08)',
    iconColor: '#C62828',
    accentColor: '#C62828',
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const activeWorkflow = useWorkflowStore((s) => s.activeWorkflow);
  const [searchQuery, setSearchQuery] = useState('');

  const counts = {
    inprogress: mockRequests.filter(r => ['in_progress', 'awaiting_confirmation'].includes(r.status)).length,
    pending:    mockRequests.filter(r => r.status === 'pending').length,
    completed:  mockRequests.filter(r => r.status === 'completed').length,
    failed:     mockRequests.filter(r => r.status === 'failed').length,
  };

  const todayRequests = mockRequests.filter(r => r.createdAt.startsWith('Today'));
  const filteredRequests = searchQuery
    ? todayRequests.filter(r =>
        r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.items.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.workflow.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : todayRequests;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* Sub-header */}
      <Box sx={{ px: 3, pt: 2, pb: 1.5, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>
            {activeWorkflow?.name ?? 'Assembly Line A'}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: '#9E9E9E' }} />
          <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>
            Home
          </Typography>
        </Box>

        {/* Search bar */}
        <Box sx={{
          display: 'flex', alignItems: 'center', gap: 1,
          px: 1.5, py: 0.625,
          border: '1px solid #DDE1E6',
          borderRadius: '8px',
          bgcolor: '#fff',
          width: 230,
          transition: 'border-color 0.15s',
          '&:focus-within': { borderColor: '#009688' },
        }}>
          <SearchIcon sx={{ fontSize: 16, color: '#9E9E9E', flexShrink: 0 }} />
          <InputBase
            placeholder="Search requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ fontSize: '0.875rem', color: '#1A2332', flex: 1, '& input': { p: 0 } }}
          />
        </Box>
      </Box>

      {/* Stats row — full width */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 1.5,
        px: 2.5,
        pb: 2,
        flexShrink: 0,
      }}>
        {statConfigs.map((stat) => {
          const Icon = stat.icon;
          const value = counts[stat.key as keyof typeof counts];
          return (
            <Box key={stat.key} sx={{
              bgcolor: '#F5F7F9',
              border: '1px solid #e8e8e8',
              borderRadius: '10px',
              boxShadow: `-3px 0 0 0 ${stat.accentColor}`,
              px: 2, py: 1.75,
              display: 'flex',
              flexDirection: 'column',
              gap: 0.75,
              transition: 'box-shadow 0.15s',
              '&:hover': {
                boxShadow: `-3px 0 0 0 ${stat.accentColor}, 0 3px 10px rgba(0,0,0,0.07)`,
              },
            }}>
              {/* Icon + count row */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 0.25 }}>
                <Box sx={{
                  width: 32, height: 32, borderRadius: '8px',
                  bgcolor: stat.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon sx={{ fontSize: 17, color: stat.iconColor }} />
                </Box>
                <Typography sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontWeight: 700, fontSize: '1.75rem',
                  color: stat.accentColor, lineHeight: 1,
                }}>
                  {value}
                </Typography>
              </Box>
              {/* Label */}
              <Typography sx={{
                fontSize: '0.75rem', fontWeight: 600,
                color: '#1A2332', lineHeight: 1.3,
              }}>
                {stat.label}
              </Typography>
              {/* Sublabel */}
              <Typography sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '0.6875rem', color: '#637381', lineHeight: 1,
              }}>
                {stat.sublabel}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {/* ── Order Material — full width horizontal card ── */}
      <Box sx={{ px: 2.5, pb: 2, flexShrink: 0 }}>
        <Box sx={{
          border: '1px solid rgba(0,169,157,0.3)',
          borderRadius: '13px',
          bgcolor: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 2.5,
          px: 2.5, py: 2,
        }}>
          {/* Icon */}
          <Box sx={{
            width: 46, height: 46, borderRadius: '11px',
            bgcolor: '#009688',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 3px 10px rgba(0,150,136,0.25)',
          }}>
            <WidgetsOutlinedIcon sx={{ fontSize: 22, color: '#fff' }} />
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography sx={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1A2332', lineHeight: 1.3 }}>
              Order Material
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: '#637381', mt: 0.25, lineHeight: 1.4 }}>
              {activeWorkflow?.name ?? 'Assembly Line A'} · Browse Sub-SKU types, set quantities and submit a fulfilment request
            </Typography>
          </Box>

          {/* CTA */}
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            onClick={() => navigate('/history/create')}
            sx={{
              bgcolor: '#00a99d',
              '&:hover': { bgcolor: '#00897b', boxShadow: '0 4px 14px rgba(0,150,136,0.3)' },
              fontWeight: 600,
              borderRadius: '8px',
              fontSize: '0.9375rem',
              boxShadow: 'none',
              minHeight: 48,
              minWidth: 160,
              textTransform: 'none',
              flexShrink: 0,
            }}
          >
            Start Ordering
          </Button>
        </Box>
      </Box>

      {/* ── Recent Requests ── */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', px: 2.5, pb: 2.5 }}>

        {/* Section header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1, flexShrink: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332' }}>
              Recent Requests
            </Typography>
            {searchQuery && (
              <Typography sx={{ fontSize: '0.75rem', color: '#637381' }}>
                {filteredRequests.length} result{filteredRequests.length !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
          <Typography
            onClick={() => navigate('/history')}
            sx={{ fontSize: '0.8125rem', color: '#00a99d', fontWeight: 500, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
          >
            View All
          </Typography>
        </Box>

        {/* Column headers */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr 110px', md: GRID_COLS },
          columnGap: '16px',
          pl: { xs: 2, md: '43px' },
          pr: '16px',
          py: 0.875,
          borderTop: '1px solid #f0f0f0',
          borderBottom: '1px solid #f0f0f0',
          flexShrink: 0,
        }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332' }}>ID No.</Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332', display: { xs: 'none', md: 'block' } }}>Request Details</Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332', display: { xs: 'none', md: 'block' } }}>Request Time</Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332' }}>Status</Typography>
        </Box>

        {/* Scrollable rows */}
        <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', display: 'flex', flexDirection: 'column', gap: 1, pt: 1 }}>
          {filteredRequests.length === 0 && (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 4 }}>
              <Typography sx={{ fontSize: '0.875rem', color: '#9E9E9E' }}>No requests match your search</Typography>
            </Box>
          )}
          {filteredRequests.map((req) => {
            const accentColor = getAccentColor(req.status);
            const [time, day] = req.createdAt.includes(',')
              ? [req.createdAt.split(', ')[1]?.trim() ?? req.createdAt, req.createdAt.split(', ')[0]?.trim() ?? '']
              : [req.createdAt, ''];

            return (
              <Box
                key={req.id}
                onClick={() => navigate('/history')}
                sx={{
                  display: 'flex',
                  border: '1px solid #e0e0e0',
                  borderRadius: '13px',
                  overflow: 'hidden',
                  bgcolor: '#fff',
                  cursor: 'pointer',
                  flexShrink: 0,
                  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
                }}
              >
                <Box sx={{ width: 14, flexShrink: 0, bgcolor: accentColor }} />
                <Box sx={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr 110px', md: GRID_COLS },
                  columnGap: '16px',
                  px: 1.5, py: 1.25,
                  alignItems: 'center',
                  minWidth: 0,
                }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace', lineHeight: 1.4 }}>
                      {req.id}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}><TypeBadge type={req.type} /></Box>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace', lineHeight: 1.4 }}>
                      {req.items}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(26,35,50,0.61)', fontFamily: '"IBM Plex Mono", monospace', mt: 0.25 }}>
                      {req.workflow}
                    </Typography>
                  </Box>
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace', lineHeight: 1.4 }}>
                      {time}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(26,35,50,0.61)', fontFamily: '"IBM Plex Mono", monospace', mt: 0.25 }}>
                      {day || 'Today'}
                    </Typography>
                  </Box>
                  <Box><StatusBadge status={req.status} /></Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
