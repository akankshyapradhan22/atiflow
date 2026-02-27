import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import { useAuthStore } from '../../stores/authStore';
import { mockApprovalRequests } from '../../data/mock';
import type { ApprovalRequest } from '../../types';

type TabValue = 'pending' | 'approved' | 'rejected' | 'expired' | 'all';
type LocalStatus = 'pending' | 'approved' | 'rejected';

const ACCENT_COLOR: Record<string, string> = {
  available:      'rgba(0,169,157,0.2)',
  finishing_soon: 'rgba(255,167,25,0.2)',
  out_of_stock:   'rgba(255,135,121,0.3)',
};

const INV_BADGE: Record<string, { bg: string; border: string; label: string }> = {
  available:      { bg: 'rgba(0,169,157,0.27)',  border: 'rgba(0,169,157,0.64)',  label: 'Available' },
  finishing_soon: { bg: 'rgba(255,136,0,0.27)',  border: 'rgba(255,102,0,0.64)', label: 'Finishing soon' },
  out_of_stock:   { bg: 'rgba(255,34,0,0.27)',   border: 'rgba(255,0,0,0.41)',   label: 'Out of Stock' },
};

// Must match between header and row content (after 14px accent bar + 15px pad = 29px, header pl = 43px accounts for 12px row outer margin + 14px bar + 17px pad ≈ 43px)
const GRID_COLS = '100px 1fr 130px 1fr';

export default function ApprovalsPage() {
  const user = useAuthStore((s) => s.user)!;
  const [tab, setTab] = useState<TabValue>('pending');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<Record<string, LocalStatus>>(
    Object.fromEntries(mockApprovalRequests.map((r) => [r.id, r.status as LocalStatus]))
  );

  const handleToggle = (id: string) =>
    setExpandedId((prev) => (prev === id ? null : id));

  const handleApprove = (id: string) => {
    setStatuses((s) => ({ ...s, [id]: 'approved' }));
    setExpandedId(null);
  };

  const handleReject = (id: string) => {
    setStatuses((s) => ({ ...s, [id]: 'rejected' }));
    setExpandedId(null);
  };

  const filtered = mockApprovalRequests.filter((r) => {
    if (tab === 'all') return true;
    if (tab === 'expired') return false;
    return statuses[r.id] === tab;
  });

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

      {/* Breadcrumb */}
      <Box sx={{ px: { xs: 2, md: 3 }, py: 1.5, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: '#1A2332' }}>
          {user.stationId}
        </Typography>
        <ChevronRightIcon sx={{ fontSize: 16, color: 'rgba(26,35,50,0.4)' }} />
        <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: '#1A2332' }}>
          Requests
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ pl: { xs: 1, md: '43px' }, flexShrink: 0 }}>
        <Tabs
          value={tab}
          onChange={(_, v: TabValue) => setTab(v)}
          sx={{
            minHeight: 36,
            '& .MuiTabs-indicator': { bgcolor: '#009688' },
            '& .MuiTab-root': {
              minHeight: 36, py: 0, fontSize: '0.875rem', fontWeight: 500,
              color: 'rgba(26,35,50,0.54)', textTransform: 'none', minWidth: 'auto', mr: 2,
            },
            '& .Mui-selected': { color: '#009688', fontWeight: 600 },
          }}
        >
          <Tab label="Pending"  value="pending" />
          <Tab label="Approved" value="approved" />
          <Tab label="Rejected" value="rejected" />
          <Tab label="Expired"  value="expired" />
          <Tab label="All"      value="all" />
        </Tabs>
      </Box>

      {/* Column header */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: GRID_COLS },
        columnGap: '16px',
        pl: { xs: 2, md: '43px' },
        pr: '122px',
        py: '8px',
        flexShrink: 0,
        borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(26,35,50,0.54)', textTransform: 'uppercase', letterSpacing: '0.05em', display: { xs: 'none', md: 'block' } }}>
          ID No.
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(26,35,50,0.54)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Request Details
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(26,35,50,0.54)', textTransform: 'uppercase', letterSpacing: '0.05em', display: { xs: 'none', md: 'block' } }}>
          Request Time
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: 'rgba(26,35,50,0.54)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Inventory Status
        </Typography>
      </Box>

      {/* Rows */}
      <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', minHeight: 0 }}>
        {filtered.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography sx={{ color: 'rgba(26,35,50,0.38)', fontSize: '0.9375rem' }}>
              No requests
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', p: '12px' }}>
            {filtered.map((req) => (
              <ApprovalRow
                key={req.id}
                req={req}
                status={statuses[req.id]}
                expanded={expandedId === req.id}
                onToggle={handleToggle}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}

          </Box>
        )}
      </Box>
    </Box>
  );
}

function ApprovalRow({
  req,
  status,
  expanded,
  onToggle,
  onApprove,
  onReject,
}: {
  req: ApprovalRequest;
  status: LocalStatus;
  expanded: boolean;
  onToggle: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const accentColor = ACCENT_COLOR[req.inventoryStatus];
  const badge = INV_BADGE[req.inventoryStatus];

  return (
    <Box sx={{
      display: 'flex',
      borderRadius: '13px',
      border: '1px solid #e0e0e0',
      bgcolor: '#fff',
      overflow: 'hidden',
      minHeight: '73px',
    }}>
      {/* Accent bar */}
      <Box sx={{ width: 14, flexShrink: 0, bgcolor: accentColor }} />

      {/* Content grid */}
      <Box sx={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: { xs: '1fr 1fr', md: GRID_COLS },
        columnGap: '16px',
        pl: '15px',
        pr: '4px',
        alignItems: 'center',
        py: '10px',
        minWidth: 0,
      }}>
        {/* ID + type badge */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.875rem',
            fontWeight: 500,
            color: '#1A2332',
            lineHeight: 1.4,
          }}>
            {req.id}
          </Typography>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            mt: '4px',
            bgcolor: 'rgba(173,173,173,0.13)',
            border: '1px solid rgba(197,197,197,0.64)',
            borderRadius: '6px',
            px: '5px',
          }}>
            <Typography sx={{ fontSize: '0.625rem', color: 'rgba(26,35,50,0.68)', lineHeight: 1.7 }}>
              {req.requestType}
            </Typography>
          </Box>
        </Box>

        {/* Request details */}
        <Box>
          <Typography sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.875rem',
            color: '#1A2332',
            lineHeight: 1.4,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}>
            {req.items}
          </Typography>
          <Typography sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.875rem',
            color: 'rgba(26,35,50,0.61)',
            lineHeight: 1.4,
          }}>
            {req.quantity} units
          </Typography>
        </Box>

        {/* Request time */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Typography sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.875rem',
            color: '#1A2332',
            lineHeight: 1.4,
          }}>
            {req.requestTime}
          </Typography>
          <Typography sx={{
            fontFamily: '"IBM Plex Mono", monospace',
            fontSize: '0.875rem',
            color: 'rgba(26,35,50,0.61)',
            lineHeight: 1.4,
          }}>
            Today
          </Typography>
        </Box>

        {/* Inventory status */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
            <Typography sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '1.5rem',
              fontWeight: 500,
              color: '#1A2332',
              lineHeight: 1,
            }}>
              {req.inventoryCount}
            </Typography>
            <Typography sx={{
              fontFamily: '"IBM Plex Mono", monospace',
              fontSize: '0.875rem',
              color: 'rgba(26,35,50,0.61)',
            }}>
              units
            </Typography>
          </Box>
          <Box sx={{
            display: 'inline-flex',
            alignItems: 'center',
            mt: '4px',
            bgcolor: badge.bg,
            border: `1px solid ${badge.border}`,
            borderRadius: '22px',
            px: '8px',
            py: '1px',
          }}>
            <Typography sx={{ fontSize: '0.625rem', fontWeight: 500, color: '#1A2332' }}>
              {badge.label}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Right: expand button OR decision panel */}
      {expanded ? (
        <Box sx={{
          width: 160,
          flexShrink: 0,
          bgcolor: '#f6f6f6',
          borderLeft: '1px solid #e8e8e8',
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px',
          display: 'flex',
          alignItems: 'center',
        }}>
          {/* Reject */}
          <Box
            onClick={() => onReject(req.id)}
            sx={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', cursor: 'pointer', py: '10px',
              '&:hover': { bgcolor: 'rgba(255,0,0,0.04)' },
            }}
          >
            <Box sx={{
              width: 36, height: 36, borderRadius: '50%',
              bgcolor: 'rgba(255,0,0,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CloseIcon sx={{ fontSize: 20, color: '#ff0000' }} />
            </Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#ff0000' }}>
              Reject
            </Typography>
          </Box>

          {/* Vertical divider */}
          <Box sx={{ width: '1px', height: 54, bgcolor: '#e0e0e0', flexShrink: 0 }} />

          {/* Approve */}
          <Box
            onClick={() => onApprove(req.id)}
            sx={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', cursor: 'pointer', py: '10px',
              '&:hover': { bgcolor: 'rgba(0,169,157,0.04)' },
            }}
          >
            <Box sx={{
              width: 36, height: 36, borderRadius: '50%',
              bgcolor: 'rgba(0,169,157,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <CheckIcon sx={{ fontSize: 20, color: '#009688' }} />
            </Box>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#009688' }}>
              Approve
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box sx={{
          width: 110, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pr: '12px',
        }}>
          {status === 'pending' ? (
            <Box
              onClick={() => onToggle(req.id)}
              sx={{
                width: 28, height: 28, borderRadius: '50%',
                bgcolor: 'rgba(159,159,159,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'rgba(159,159,159,0.18)' },
              }}
            >
              <ChevronRightIcon sx={{ fontSize: 16, color: '#637381' }} />
            </Box>
          ) : status === 'approved' ? (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: '5px',
              bgcolor: 'rgba(0,169,157,0.12)',
              border: '1px solid rgba(0,169,157,0.4)',
              borderRadius: '22px',
              px: '10px', py: '5px',
            }}>
              <CheckIcon sx={{ fontSize: 13, color: '#009688' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#009688', lineHeight: 1 }}>
                Approved
              </Typography>
            </Box>
          ) : (
            <Box sx={{
              display: 'flex', alignItems: 'center', gap: '5px',
              bgcolor: 'rgba(255,0,0,0.08)',
              border: '1px solid rgba(255,0,0,0.25)',
              borderRadius: '22px',
              px: '10px', py: '5px',
            }}>
              <CloseIcon sx={{ fontSize: 13, color: '#d32f2f' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#d32f2f', lineHeight: 1 }}>
                Rejected
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
