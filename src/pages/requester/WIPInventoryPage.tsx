import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import { mockInventory } from '../../data/mock';
import type { InventoryRow } from '../../types';

type TabValue = 'all' | 'available' | 'finishing_soon' | 'out_of_stock';
type ViewMode = 'list' | 'grid';
type Status = 'available' | 'finishing_soon' | 'out_of_stock';

function getStatus(row: InventoryRow): Status {
  if (row.available === 0) return 'out_of_stock';
  if (row.available <= 4) return 'finishing_soon';
  return 'available';
}

const STATUS_CONFIG: Record<Status, {
  label: string;
  badgeBg: string;
  badgeBorder: string;
  accentColor: string;
  listAccentBg: string;
}> = {
  available: {
    label: 'Available',
    badgeBg: 'rgba(0,169,157,0.27)',
    badgeBorder: 'rgba(0,169,157,0.64)',
    accentColor: '#009688',
    listAccentBg: 'rgba(0,169,157,0.2)',
  },
  finishing_soon: {
    label: 'Finishing soon',
    badgeBg: 'rgba(255,217,92,0.24)',
    badgeBorder: '#ffa719',
    accentColor: '#ffa719',
    listAccentBg: '#ffc15e',
  },
  out_of_stock: {
    label: 'Out of Stock',
    badgeBg: 'rgba(255,92,92,0.24)',
    badgeBorder: '#ff5c5c',
    accentColor: '#ff5c5c',
    listAccentBg: 'rgba(255,135,121,0.49)',
  },
};

type RowWithStatus = InventoryRow & { _status: Status };

function StatusBadge({ status }: { status: Status }) {
  const { label, badgeBg, badgeBorder } = STATUS_CONFIG[status];
  return (
    <Box sx={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      px: 1.25, py: '3px',
      bgcolor: badgeBg, border: `1px solid ${badgeBorder}`, borderRadius: '22px',
      flexShrink: 0,
    }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#1A2332', whiteSpace: 'nowrap' }}>
        {label}
      </Typography>
    </Box>
  );
}

// ─── List View ───────────────────────────────────────────────────────────────

// Mirrors Request History column pattern: flexible detail col + fixed supporting cols
const LIST_GRID_COLS = '1fr 155px 80px 110px';

function ListView({ rows }: { rows: RowWithStatus[] }) {
  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      {/* Column headers — pl offset matches: card px:2(16) + accent(14) + content px:1.5(12) = 42px */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: LIST_GRID_COLS,
        columnGap: '16px',
        px: 3, pl: '43px', py: 1,
        borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0',
        flexShrink: 0,
      }}>
        {['Sub-SKU Details', 'Status', 'Quantity', 'Actions'].map(h => (
          <Typography key={h} sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332' }}>{h}</Typography>
        ))}
      </Box>

      {/* Rows */}
      <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        {rows.length === 0 ? (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
            <Typography sx={{ color: '#9E9E9E', fontSize: '0.875rem' }}>No items found</Typography>
          </Box>
        ) : (
          rows.map((row, idx) => {
            const cfg = STATUS_CONFIG[row._status];
            return (
              <Box key={idx} sx={{
                display: 'flex',
                border: '1px solid #e0e0e0',
                borderRadius: '13px',
                overflow: 'hidden',
                bgcolor: '#fff',
                '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
              }}>
                <Box sx={{ width: 14, flexShrink: 0, bgcolor: cfg.listAccentBg }} />

                <Box sx={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: LIST_GRID_COLS,
                  px: 1.5, py: 1.25,
                  alignItems: 'center',
                  minWidth: 0,
                }}>
                  {/* Sub-SKU Details */}
                  <Box>
                    <Typography sx={{
                      fontSize: '0.875rem', fontWeight: 500, color: '#1A2332',
                      fontFamily: '"IBM Plex Mono", monospace', lineHeight: 1.4,
                    }}>
                      {row.sku}
                    </Typography>
                    <Typography sx={{
                      fontSize: '0.875rem', color: 'rgba(26,35,50,0.61)',
                      fontFamily: '"IBM Plex Mono", monospace', mt: 0.25,
                    }}>
                      {row.available + row.reserved} units
                    </Typography>
                  </Box>

                  {/* Status */}
                  <Box>
                    <StatusBadge status={row._status} />
                    <Typography sx={{
                      fontSize: '0.5rem', fontStyle: 'italic',
                      color: 'rgba(26,35,50,0.68)', mt: 0.5, display: 'block',
                    }}>
                      Updated 30 mins ago
                    </Typography>
                  </Box>

                  {/* Quantity */}
                  <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#1A2332' }}>
                    {row.available}
                  </Typography>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
                    <IconButton size="small" sx={{ width: 36, height: 36, bgcolor: '#f1f1f1', borderRadius: '50%', '&:hover': { bgcolor: '#e5e5e5' } }}>
                      <RefreshIcon sx={{ fontSize: 17, color: '#1A2332' }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#1A2332' }}>
                      <MoreVertIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                    <IconButton size="small" sx={{ color: '#1A2332' }}>
                      <KeyboardArrowDownIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Box>
  );
}

// ─── Grid View ───────────────────────────────────────────────────────────────

function GridView({ rows }: { rows: RowWithStatus[] }) {
  if (rows.length === 0) {
    return (
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography sx={{ color: '#9E9E9E', fontSize: '0.875rem' }}>No items found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      flex: 1,
      overflow: 'auto',
      scrollbarGutter: 'stable',
      px: 2,
      py: 2,
      borderTop: '1px solid #f0f0f0',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1.75,
      alignContent: 'start',
    }}>
      {rows.map((row, idx) => {
        const cfg = STATUS_CONFIG[row._status];
        return (
          <Box key={idx} sx={{
            bgcolor: '#fff',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            // Left accent via box-shadow (no layout impact, matches Figma)
            boxShadow: `-3px 0 0 0 ${cfg.accentColor}`,
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            cursor: 'default',
            transition: 'box-shadow 0.15s',
            '&:hover': {
              boxShadow: `-3px 0 0 0 ${cfg.accentColor}, 0 3px 10px rgba(0,0,0,0.08)`,
            },
          }}>
            {/* Sub-SKU identifier */}
            <Typography sx={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#1A2332',
              fontFamily: '"IBM Plex Mono", monospace',
              lineHeight: 1.4,
              wordBreak: 'break-word',
            }}>
              {row.sku}
            </Typography>

            {/* Parent SKU label */}
            <Typography sx={{
              fontSize: '0.75rem',
              color: 'rgba(26,35,50,0.63)',
              fontFamily: '"Roboto Mono", monospace',
              lineHeight: 1.4,
            }}>
              SKU {row.sku}
            </Typography>

            {/* Status badge */}
            <Box sx={{ mt: 0.25 }}>
              <StatusBadge status={row._status} />
            </Box>

            {/* Quantity + units */}
            <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mt: 0.5 }}>
              <Typography sx={{
                fontSize: '2rem',
                fontFamily: '"IBM Plex Mono", monospace',
                fontWeight: 600,
                color: '#1A2332',
                lineHeight: 1,
              }}>
                {row.available}
              </Typography>
              <Typography sx={{
                fontSize: '1.5rem',
                fontFamily: '"IBM Plex Mono", monospace',
                color: '#1A2332',
                lineHeight: 1,
              }}>
                Units
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// ─── Overview Chips ───────────────────────────────────────────────────────────

const OVERVIEW_ITEMS: { label: string; count: number; bg: string; border: string }[] = [
  { label: 'Available',     count: 134, bg: 'rgba(0,169,157,0.24)',  border: '#00a99d' },
  { label: 'Low Stock',     count: 155, bg: 'rgba(255,217,92,0.24)', border: '#ffa719' },
  { label: 'Out of stock',  count: 15,  bg: 'rgba(255,92,92,0.24)',  border: '#ff5c5c' },
];


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WIPInventoryPage() {
  const [tab, setTab] = useState<TabValue>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const rows: RowWithStatus[] = mockInventory.map(r => ({ ...r, _status: getStatus(r) }));
  const filtered = rows.filter(r => tab === 'all' || r._status === tab);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', height: '100%', minHeight: 0 }}>

      {/* ── Main content column ── */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

        {/* Header */}
        <Box sx={{ px: 3, pt: 2, pb: 0, flexShrink: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1A2332', mb: 1.5 }}>
            WIP Inventory
          </Typography>

          {/* Tabs row + view toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                minHeight: 38,
                '& .MuiTab-root': {
                  minHeight: 38, fontSize: '0.875rem', fontWeight: 500,
                  color: '#1A2332', px: 1.5, minWidth: 'auto', textTransform: 'none',
                },
                '& .Mui-selected': { color: '#1A2332' },
                '& .MuiTabs-indicator': { bgcolor: '#00a99d', height: 2 },
              }}
            >
              <Tab value="all" label="All" />
              <Tab value="available" label="Available" />
              <Tab value="finishing_soon" label="Finishing soon" />
              <Tab value="out_of_stock" label="Out of Stock" />
            </Tabs>

            {/* List / Grid toggle */}
            <Box sx={{
              display: 'flex', alignItems: 'center',
              bgcolor: '#e5e5e5', border: '1px solid #e0e0e0',
              borderRadius: '8px', p: '2px', gap: '2px', flexShrink: 0,
            }}>
              <IconButton size="small" onClick={() => setViewMode('list')} disableRipple={false}
                sx={{ width: 34, height: 28, borderRadius: '6px', color: '#1A2332',
                  bgcolor: viewMode === 'list' ? '#fff' : 'transparent',
                  '&:hover': { bgcolor: viewMode === 'list' ? '#fff' : 'rgba(0,0,0,0.06)' },
                  transition: 'background-color 0.15s' }}>
                <FormatListBulletedIcon sx={{ fontSize: 18 }} />
              </IconButton>
              <IconButton size="small" onClick={() => setViewMode('grid')} disableRipple={false}
                sx={{ width: 34, height: 28, borderRadius: '6px', color: '#1A2332',
                  bgcolor: viewMode === 'grid' ? '#fff' : 'transparent',
                  '&:hover': { bgcolor: viewMode === 'grid' ? '#fff' : 'rgba(0,0,0,0.06)' },
                  transition: 'background-color 0.15s' }}>
                <GridViewIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        </Box>

        {/* Content area */}
        {viewMode === 'list' ? <ListView rows={filtered} /> : <GridView rows={filtered} />}
      </Box>

      {/* ── Overview sidebar ── */}
      <Box sx={{
        width: 172, flexShrink: 0,
        borderLeft: '1px solid #f0f0f0',
        display: 'flex', flexDirection: 'column',
        px: 2, pt: 2.5, pb: 2, gap: 1.25,
        overflow: 'auto', scrollbarGutter: 'stable',
      }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', color: 'rgba(26,35,50,0.55)', textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.5 }}>
          Overview
        </Typography>
        {OVERVIEW_ITEMS.map(({ label, count, bg, border }) => (
          <Box key={label} sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', textAlign: 'center', width: '100%' }}>
              {label}
            </Typography>
            <Box sx={{
              bgcolor: bg, border: `1px solid ${border}`,
              borderRadius: '10px', px: '10px', py: '12px',
              width: '100%', display: 'flex', flexDirection: 'column', gap: 2,
            }}>
              <Typography sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontWeight: 600, fontSize: '1.75rem', color: '#1A2332', lineHeight: 1,
              }}>
                {count}
              </Typography>
              <Typography sx={{
                fontFamily: '"IBM Plex Mono", monospace',
                fontSize: '1rem', color: '#1A2332', lineHeight: 1,
              }}>
                SKU
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
