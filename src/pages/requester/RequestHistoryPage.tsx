import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { mockRequests } from '../../data/mock';
import type { Request } from '../../types';

const TAB_VALUES = ['all', 'in_progress', 'completed', 'scheduled', 'cancelled'] as const;
type TabValue = typeof TAB_VALUES[number];

const TAB_LABELS: Record<TabValue, string> = {
  all: 'All',
  in_progress: 'In Progress',
  completed: 'Completed',
  scheduled: 'Scheduled',
  cancelled: 'Cancelled',
};

function filterRequests(requests: Request[], tab: TabValue): Request[] {
  if (tab === 'all') return requests;
  if (tab === 'in_progress') return requests.filter(r => ['in_progress', 'pending', 'awaiting_confirmation'].includes(r.status));
  if (tab === 'completed') return requests.filter(r => r.status === 'completed');
  if (tab === 'scheduled') return [];
  if (tab === 'cancelled') return requests.filter(r => r.status === 'failed');
  return requests;
}

function getAccentColor(status: Request['status']): string {
  switch (status) {
    case 'completed': return 'rgba(0,169,157,0.2)';
    case 'in_progress':
    case 'pending':
    case 'awaiting_confirmation': return '#ffc15e';
    case 'failed': return 'rgba(255,135,121,0.49)';
    default: return 'rgba(0,0,0,0.06)';
  }
}

function StatusBadge({ status }: { status: Request['status'] }) {
  const styles: Record<string, { label: string; bg: string; border: string }> = {
    completed:             { label: 'Completed',  bg: 'rgba(0,169,157,0.27)',  border: 'rgba(0,169,157,0.64)' },
    in_progress:           { label: 'In Process', bg: 'rgba(255,217,92,0.24)', border: '#ffa719' },
    pending:               { label: 'Pending',    bg: 'rgba(255,217,92,0.24)', border: '#ffa719' },
    awaiting_confirmation: { label: 'Awaiting',   bg: 'rgba(255,217,92,0.24)', border: '#ffa719' },
    failed:                { label: 'Cancelled',  bg: 'rgba(255,34,0,0.27)',   border: 'rgba(255,0,0,0.41)' },
    breakdown:             { label: 'Breakdown',  bg: 'rgba(106,27,154,0.15)', border: 'rgba(106,27,154,0.4)' },
  };
  const s = styles[status] ?? styles.completed;
  return (
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      px: 1.25,
      py: '3px',
      bgcolor: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: '22px',
    }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#1A2332' }}>{s.label}</Typography>
    </Box>
  );
}

function TypeBadge({ type }: { type: Request['type'] }) {
  const labels: Record<string, string> = {
    material: 'Fulfillment Request',
    container: 'Container',
    return_trolley: 'Return Container',
  };
  return (
    <Box sx={{
      display: 'inline-flex',
      alignItems: 'center',
      px: '5px',
      py: '1px',
      bgcolor: 'rgba(173,173,173,0.13)',
      border: '1px solid rgba(197,197,197,0.64)',
      borderRadius: '6px',
    }}>
      <Typography sx={{ fontSize: '0.625rem', color: 'rgba(26,35,50,0.68)', fontWeight: 400 }}>
        {labels[type] ?? type}
      </Typography>
    </Box>
  );
}

/**
 * The └→ branch connector.
 * Renders a vertical line that descends from the parent row,
 * then bends right with an arrowhead — visually linking the
 * parent request card to its child content block.
 */
function BranchConnector() {
  return (
    <Box sx={{
      width: 32,
      flexShrink: 0,
      alignSelf: 'stretch',
      position: 'relative',
    }}>
      {/* Vertical segment going down from parent */}
      <Box sx={{
        position: 'absolute',
        left: 10,
        top: 0,
        bottom: '50%',
        borderLeft: '1.5px solid #BDBDBD',
      }} />
      {/* Horizontal elbow pointing right */}
      <Box sx={{
        position: 'absolute',
        left: 10,
        top: '50%',
        width: 14,
        borderTop: '1.5px solid #BDBDBD',
      }} />
      {/* Arrow head */}
      <Box sx={{
        position: 'absolute',
        left: 23,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 0,
        height: 0,
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
        borderLeft: '5px solid #BDBDBD',
      }} />
    </Box>
  );
}

interface TripDetail {
  tripId: string;
  carryingQty: string;
  tripBookingTime: string;
  started: string;
  endTime: string;
}

interface ActiveTrip {
  tripId: string;
  started: string;
  eta: string;
  progress: number;   // 0–100
  tripTime: string;
}

interface TripData {
  summaryLabel: string;
  completedUnits: number;
  totalUnits: number;
  activeTrip?: ActiveTrip;  // present for in-progress requests
  trips: TripDetail[];
}

const mockTripDetails: Record<string, TripData> = {
  'Req-001': {
    summaryLabel: 'Material Fulfilment Request',
    completedUnits: 700,
    totalUnits: 1000,
    activeTrip: {
      tripId: 'TR-123',
      started: 'Today, 3:15 pm',
      eta: 'Today, 3:25 pm',
      progress: 55,
      tripTime: '13 mins',
    },
    trips: [],
  },
  'Req-004': {
    summaryLabel: 'Material Fulfilment Request',
    completedUnits: 0,
    totalUnits: 400,
    activeTrip: {
      tripId: 'TR-126',
      started: 'Today, 2:05 pm',
      eta: 'Today, 2:20 pm',
      progress: 30,
      tripTime: '8 mins',
    },
    trips: [],
  },
  'Req-003': {
    summaryLabel: 'Material Fulfilment Request',
    completedUnits: 1000,
    totalUnits: 1000,
    trips: [
      { tripId: 'TR-119', carryingQty: '500 units', tripBookingTime: 'Today, 2:45 pm', started: 'Today, 2:50 pm', endTime: '15 mins' },
      { tripId: 'TR-118', carryingQty: '500 units', tripBookingTime: 'Today, 2:30 pm', started: 'Today, 2:35 pm', endTime: '15 mins' },
    ],
  },
  'Req-006': {
    summaryLabel: 'Material Fulfilment Request',
    completedUnits: 300,
    totalUnits: 300,
    trips: [
      { tripId: 'TR-115', carryingQty: '300 units', tripBookingTime: 'Today, 1:00 pm', started: 'Today, 1:05 pm', endTime: '18 mins' },
    ],
  },
};

const GRID_COLS = '140px 1fr 155px 170px 110px';
const TRIP_GRID = '110px 160px 175px 1fr 110px';
const IN_PROGRESS_GRID = '110px 175px 175px 1fr 110px';

function ProgressBar({ percent }: { percent: number }) {
  return (
    <Box sx={{
      position: 'relative',
      bgcolor: '#eee',
      border: '0.5px solid rgba(0,0,0,0.27)',
      borderRadius: '8px',
      height: 22,
      width: 90,
      overflow: 'hidden',
    }}>
      <Box sx={{
        position: 'absolute',
        left: '1px', top: '1px', bottom: '1px',
        width: `calc(${percent}% - 2px)`,
        minWidth: percent > 0 ? 28 : 0,
        bgcolor: '#00a99d',
        borderRadius: '7px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Typography sx={{
          color: '#fff',
          fontSize: '0.8125rem',
          fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 500,
          lineHeight: 1,
        }}>
          {percent}%
        </Typography>
      </Box>
    </Box>
  );
}

export default function RequestHistoryPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<TabValue>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const filtered = filterRequests(mockRequests, tab);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* Breadcrumb */}
      <Box sx={{ px: 3, pt: 2, pb: 0, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5 }}>
          <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>
            {user?.stationId ?? 'Station 001'}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: '#9E9E9E' }} />
          <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>
            Request History
          </Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Box sx={{ pl: '43px', flexShrink: 0 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            minHeight: 38,
            '& .MuiTab-root': { minHeight: 38, fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', px: 1.5, minWidth: 'auto', textTransform: 'none' },
            '& .Mui-selected': { color: '#1A2332', fontWeight: 500 },
            '& .MuiTabs-indicator': { bgcolor: '#00a99d', height: 2 },
          }}
        >
          {TAB_VALUES.map(v => (
            <Tab key={v} value={v} label={TAB_LABELS[v]} />
          ))}
        </Tabs>
      </Box>

      {/* Column headers */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: GRID_COLS,
        columnGap: '16px',
        pl: '43px',
        pr: '29px',
        py: 1,
        borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0',
        flexShrink: 0,
      }}>
        {['ID No.', 'Request Details', 'Request Time', 'Status', 'Actions'].map(h => (
          <Typography key={h} sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332' }}>
            {h}
          </Typography>
        ))}
      </Box>

      {/* Rows */}
      <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {filtered.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
            <Typography sx={{ color: '#9E9E9E', fontSize: '0.875rem' }}>No requests found</Typography>
          </Box>
        ) : (
          filtered.map(req => {
            const expanded = expandedRow === req.id;
            const tripData = mockTripDetails[req.id];
            const accentColor = getAccentColor(req.status);
            const [time, day] = req.createdAt.includes(',')
              ? [req.createdAt.split(', ')[1]?.trim() ?? req.createdAt, req.createdAt.split(', ')[0]?.trim() ?? '']
              : [req.createdAt, ''];

            return (
              <Box key={req.id}>
                {/* Parent request row — always fully rounded */}
                <Box sx={{
                  display: 'flex',
                  border: '1px solid #e0e0e0',
                  borderRadius: '13px',
                  overflow: 'hidden',
                  bgcolor: '#fff',
                  '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
                }}>
                  <Box sx={{ width: 14, flexShrink: 0, bgcolor: accentColor }} />
                  <Box sx={{
                    flex: 1,
                    display: 'grid',
                    gridTemplateColumns: GRID_COLS,
                    columnGap: '16px',
                    px: 1.5,
                    py: 1.25,
                    alignItems: 'center',
                    minWidth: 0,
                  }}>
                    {/* ID + type badge */}
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace', lineHeight: 1.4 }}>
                        {req.id}
                      </Typography>
                      <Box sx={{ mt: 0.5 }}><TypeBadge type={req.type} /></Box>
                    </Box>

                    {/* Request details */}
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace', lineHeight: 1.4 }}>
                        {req.items}
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.61)', fontFamily: '"IBM Plex Mono", monospace', mt: 0.25 }}>
                        {req.id === 'Req-001' ? '1300 units' : '100 units'}
                      </Typography>
                    </Box>

                    {/* Request time */}
                    <Box>
                      <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace', lineHeight: 1.4 }}>
                        {time}
                      </Typography>
                      <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.61)', fontFamily: '"IBM Plex Mono", monospace', mt: 0.25 }}>
                        {day || 'Today'}
                      </Typography>
                    </Box>

                    {/* Status */}
                    <Box>
                      <StatusBadge status={req.status} />
                      <Typography sx={{ fontSize: '0.5rem', fontStyle: 'italic', color: 'rgba(26,35,50,0.68)', mt: 0.75, display: 'block' }}>
                        Updated 30 mins ago
                      </Typography>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                      <IconButton
                        size="small"
                        sx={{ width: 36, height: 36, bgcolor: '#f1f1f1', borderRadius: '50%', '&:hover': { bgcolor: '#e5e5e5' } }}
                      >
                        <RefreshIcon sx={{ fontSize: 18, color: '#1A2332' }} />
                      </IconButton>
                      <IconButton size="small" sx={{ color: '#1A2332' }}>
                        <MoreVertIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        sx={{ color: '#1A2332' }}
                        onClick={() => setExpandedRow(expanded ? null : req.id)}
                      >
                        {expanded
                          ? <KeyboardArrowUpIcon sx={{ fontSize: 18 }} />
                          : <KeyboardArrowDownIcon sx={{ fontSize: 18 }} />}
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                {/* ── Expanded child block connected via └→ branch node ── */}
                {expanded && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', pl: '14px', mt: 0.75 }}>
                    <BranchConnector />

                    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0.75, minWidth: 0 }}>

                      {/* ── IN PROGRESS: active trip row with progress bar ── */}
                      {['in_progress', 'pending', 'awaiting_confirmation'].includes(req.status) && (
                        <Box sx={{
                          border: '1px solid #e0e0e0',
                          borderRadius: '13px',
                          overflow: 'hidden',
                          bgcolor: '#f7f7f7',
                        }}>
                          {/* Header */}
                          <Box sx={{
                            display: 'grid',
                            gridTemplateColumns: IN_PROGRESS_GRID,
                            px: 2, py: 0.875,
                            borderBottom: '1px solid #ebebeb',
                          }}>
                            {['Trip ID', 'Started', 'ETA', 'Progress', 'Trip Time'].map(h => (
                              <Typography key={h} sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1A2332' }}>
                                {h}
                              </Typography>
                            ))}
                          </Box>

                          {/* Data row */}
                          {tripData?.activeTrip ? (
                            <Box sx={{
                              display: 'grid',
                              gridTemplateColumns: IN_PROGRESS_GRID,
                              px: 2, py: 1,
                              alignItems: 'center',
                            }}>
                              <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace' }}>
                                {tripData.activeTrip.tripId}
                              </Typography>
                              <Box>
                                <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace' }}>
                                  {tripData.activeTrip.started}
                                </Typography>
                              </Box>
                              <Box>
                                <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace' }}>
                                  {tripData.activeTrip.eta}
                                </Typography>
                              </Box>
                              <ProgressBar percent={tripData.activeTrip.progress} />
                              <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace' }}>
                                {tripData.activeTrip.tripTime}
                              </Typography>
                            </Box>
                          ) : (
                            <Box sx={{ px: 2, py: 1.25 }}>
                              <Typography sx={{ fontSize: '0.8125rem', color: '#9E9E9E' }}>No active trip</Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      {/* ── COMPLETED: summary banner + full trip history table ── */}
                      {req.status === 'completed' && (
                        <>
                          {/* Summary banner */}
                          <Box sx={{
                            display: 'flex', alignItems: 'center',
                            bgcolor: 'rgba(0,169,157,0.16)',
                            borderRadius: '8px', px: 1.5, py: 0.875, gap: 2,
                          }}>
                            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', flexShrink: 0 }}>
                              {tripData?.summaryLabel ?? 'Fulfilment Request'}
                            </Typography>
                            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography sx={{ fontSize: '0.875rem', color: '#1A2332' }}>Completed</Typography>
                              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace' }}>
                                {tripData ? `${tripData.completedUnits}/${tripData.totalUnits} units` : '–'}
                              </Typography>
                            </Box>
                            <Button
                              variant="outlined"
                              size="small"
                              sx={{
                                borderColor: '#00a99d', color: '#00a99d',
                                fontWeight: 600, fontSize: '0.8125rem',
                                borderRadius: '6px', px: 1, py: '5px',
                                minHeight: 'unset', textTransform: 'none', flexShrink: 0,
                                bgcolor: '#fff',
                                '&:hover': { bgcolor: 'rgba(0,169,157,0.06)', borderColor: '#00a99d' },
                              }}
                            >
                              Book Next Trip
                            </Button>
                          </Box>

                          {/* Trip history table */}
                          {tripData && tripData.trips.length > 0 && (
                            <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', bgcolor: '#f7f7f7' }}>
                              <Box sx={{ display: 'grid', gridTemplateColumns: TRIP_GRID, px: 2, py: 0.875, borderBottom: '1px solid #ebebeb' }}>
                                {['Trip ID', 'Carrying Quantity', 'Trip Booking Time', 'Started', 'End Time'].map(h => (
                                  <Typography key={h} sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1A2332' }}>{h}</Typography>
                                ))}
                              </Box>
                              <Box sx={{
                                maxHeight: 130, overflowY: 'auto', scrollbarGutter: 'stable',
                                '&::-webkit-scrollbar': { width: 6 },
                                '&::-webkit-scrollbar-thumb': { bgcolor: '#9e9e9e', borderRadius: 20 },
                              }}>
                                {tripData.trips.map((trip, idx) => (
                                  <Box key={idx} sx={{ display: 'grid', gridTemplateColumns: TRIP_GRID, px: 2, py: 0.75, borderTop: idx === 0 ? 'none' : '1px solid #ebebeb' }}>
                                    {[trip.tripId, trip.carryingQty, trip.tripBookingTime, trip.started, trip.endTime].map((val, i) => (
                                      <Typography key={i} sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace' }}>{val}</Typography>
                                    ))}
                                  </Box>
                                ))}
                              </Box>
                            </Box>
                          )}
                        </>
                      )}

                      {/* Fallback for other statuses */}
                      {!['in_progress', 'pending', 'awaiting_confirmation', 'completed'].includes(req.status) && (
                        <Box sx={{ px: 2, py: 1.25, border: '1px solid #e0e0e0', borderRadius: '8px', bgcolor: '#f7f7f7' }}>
                          <Typography sx={{ fontSize: '0.8125rem', color: '#9E9E9E' }}>No details available</Typography>
                        </Box>
                      )}

                    </Box>
                  </Box>
                )}

              </Box>
            );
          })
        )}
      </Box>

      {/* Footer */}
      <Box sx={{
        px: 3, py: 1.5,
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        bgcolor: '#fff',
        flexShrink: 0,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: '0.75rem', color: '#1A2332', fontWeight: 400 }}>
            1-{Math.min(filtered.length, 15)} of 200
          </Typography>
          <IconButton size="small" disabled sx={{ color: '#9E9E9E', p: 0.25 }}>
            <NavigateBeforeIcon sx={{ fontSize: 20 }} />
          </IconButton>
          <IconButton size="small" sx={{ color: '#1A2332', p: 0.25 }}>
            <NavigateNextIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => navigate('/history/create')}
          sx={{
            bgcolor: '#00a99d',
            '&:hover': { bgcolor: '#00897b' },
            fontWeight: 600,
            borderRadius: '8px',
            px: 2.5,
            py: 1,
            fontSize: '0.9375rem',
            boxShadow: '-2px 2px 4px rgba(0,0,0,0.18)',
            minHeight: 45,
            textTransform: 'none',
          }}
        >
          Make New Request
        </Button>
      </Box>
    </Box>
  );
}
