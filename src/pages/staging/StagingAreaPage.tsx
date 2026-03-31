import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { mockStagingAreas } from '../../data/mock';
import type { StagingArea, StagingAreaCell } from '../../types';
import { PRIMARY } from '../../theme';

const CARD_COLORS = ['#009688', '#ff726a', '#f59e0b', '#6366f1'];

const ROW_LABELS = ['A', 'B', 'C', 'D', 'E'];

type FilterTab = 'All' | 'Active' | 'Inactive';

function getCellStyle(status: StagingAreaCell['status']) {
  switch (status) {
    case 'filled':
      return { bg: 'rgba(0,150,136,0.15)', border: '2px solid #00a99d' };
    case 'blocked':
      return { bg: 'rgba(255,92,92,0.15)', border: '2px solid #ff5c5c' };
    case 'reserved':
      return { bg: 'rgba(255,217,92,0.37)', border: '1px solid #ffa719' };
    default:
      return { bg: '#f5f5f5', border: '1px solid #c9c9c9' };
  }
}

function CellDot({ status }: { status: StagingAreaCell['status'] }) {
  if (status === 'filled') {
    return (
      <Box sx={{
        width: 27, height: 27, borderRadius: '8px', bgcolor: '#009688',
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />
    );
  }
  if (status === 'blocked') {
    return (
      <Box sx={{
        width: 18, height: 18, borderRadius: '50%', bgcolor: '#ff5c5c',
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
      }} />
    );
  }
  return null;
}

// ── Detail View ──────────────────────────────────────────────────────────────
function DetailView({ area, onBack }: { area: StagingArea; onBack: () => void }) {
  const [mode, setMode] = useState<'view' | 'manage'>('view');

  const getCell = (row: number, col: number) =>
    area.cells.find((c) => c.row === row && c.col === col);

  const rows = ROW_LABELS.slice(0, area.rows);
  const cols = Array.from({ length: area.cols }, (_, i) => i + 1);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ px: 2.5, pt: 2, pb: 1.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
        <Box>
          <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a2332', lineHeight: 1.3 }}>
            {area.name}
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.63)', fontFamily: '"Roboto Mono", monospace', mt: 0.25 }}>
            {area.cols} x {area.rows} cells
          </Typography>
        </Box>

        {/* View / Manage toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#f1f1f1', border: '1px solid #e0e0e0', borderRadius: '10px', p: '2px', height: 44 }}>
          <Button
            onClick={() => setMode('view')}
            startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
            sx={{
              height: 40, px: 2, borderRadius: '8px', textTransform: 'none',
              fontSize: '0.875rem', fontWeight: 500, color: '#1a2332',
              bgcolor: mode === 'view' ? '#fff' : 'transparent',
              boxShadow: mode === 'view' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              '&:hover': { bgcolor: mode === 'view' ? '#fff' : 'rgba(0,0,0,0.04)' },
            }}
          >
            View
          </Button>
          <Button
            onClick={() => setMode('manage')}
            startIcon={<EditOutlinedIcon sx={{ fontSize: 16 }} />}
            sx={{
              height: 40, px: 2, borderRadius: '8px', textTransform: 'none',
              fontSize: '0.875rem', fontWeight: 500, color: '#1a2332',
              bgcolor: mode === 'manage' ? '#fff' : 'transparent',
              boxShadow: mode === 'manage' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              '&:hover': { bgcolor: mode === 'manage' ? '#fff' : 'rgba(0,0,0,0.04)' },
            }}
          >
            Manage
          </Button>
        </Box>
      </Box>

      {/* Cell grid */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2.5, pb: 2 }}>
        {/* Column labels */}
        <Box sx={{ display: 'flex', ml: '28px', mb: '6px', gap: '10px' }}>
          {cols.map((c) => (
            <Box key={c} sx={{ width: 55, textAlign: 'center', fontSize: '0.875rem', color: 'rgba(26,35,50,0.63)', fontFamily: '"Roboto Mono", monospace', fontWeight: 500, flexShrink: 0 }}>
              {c}
            </Box>
          ))}
        </Box>

        {/* Rows */}
        {rows.map((rowLabel, rowIdx) => (
          <Box key={rowLabel} sx={{ display: 'flex', alignItems: 'center', gap: '10px', mb: '10px' }}>
            {/* Row label */}
            <Box sx={{ width: 18, textAlign: 'center', fontSize: '0.875rem', color: 'rgba(26,35,50,0.63)', fontFamily: '"Roboto Mono", monospace', fontWeight: 500, flexShrink: 0 }}>
              {rowLabel}
            </Box>
            {/* Cells */}
            {cols.map((colIdx) => {
              const cell = getCell(rowIdx + 1, colIdx);
              const status = cell?.status ?? 'empty';
              const style = getCellStyle(status);
              return (
                <Box
                  key={colIdx}
                  sx={{
                    width: 55, height: 55, borderRadius: '9px', flexShrink: 0,
                    bgcolor: style.bg, border: style.border,
                    position: 'relative', cursor: mode === 'manage' ? 'pointer' : 'default',
                    '&:hover': mode === 'manage' ? { opacity: 0.8 } : {},
                  }}
                >
                  <CellDot status={status} />
                </Box>
              );
            })}
          </Box>
        ))}

        {/* Legend */}
        <Box sx={{ display: 'flex', gap: 3, mt: 2, ml: '28px', alignItems: 'center' }}>
          {[
            { label: 'Available', bg: 'rgba(0,150,136,0.15)', border: '1px solid #009688' },
            { label: 'Reserved',  bg: 'rgba(255,217,92,0.37)', border: '1px solid #ffa719' },
            { label: 'Blocked',   bg: 'rgba(255,92,92,0.15)', border: '1px solid #ff5c5c' },
          ].map(({ label, bg, border }) => (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: bg, border }} />
              <Typography sx={{ fontSize: '0.875rem', color: '#1a2332' }}>{label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
function StagingAreaCard({ area, color, onClick }: { area: StagingArea; color: string; onClick: () => void }) {
  const pct = Math.round((area.utilisedCells / area.totalCells) * 100);

  return (
    <Box
      onClick={onClick}
      sx={{
        width: 270, borderRadius: '10px', border: '1px solid #e0e0e0',
        bgcolor: '#fff', cursor: 'pointer',
        boxShadow: `-3px 0 0 0 ${color}`,
        '&:hover': { boxShadow: `-3px 0 0 0 ${color}, 0 2px 8px rgba(0,0,0,0.08)` },
        overflow: 'hidden',
      }}
    >
      {/* Top row */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, pt: 1.5 }}>
        <Chip
          label={`Updated ${area.updatedMinsAgo} mins ago`}
          size="small"
          sx={{
            height: 22, fontSize: '0.625rem', color: 'rgba(26,35,50,0.51)',
            bgcolor: 'transparent', border: '1px solid #e8e8e8', borderRadius: '7px',
            '& .MuiChip-label': { px: '5px' },
          }}
        />
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" sx={{ bgcolor: '#f1f1f1', borderRadius: '50%', width: 36, height: 36, '&:hover': { bgcolor: '#e5e5e5' } }}
            onClick={(e) => e.stopPropagation()}>
            <EditOutlinedIcon sx={{ fontSize: 16, color: '#637381' }} />
          </IconButton>
          <IconButton size="small" sx={{ bgcolor: '#fff', border: '1px solid #f0f0f0', borderRadius: '50%', width: 36, height: 36, '&:hover': { bgcolor: '#f5f5f5' } }}
            onClick={(e) => e.stopPropagation()}>
            <MoreVertIcon sx={{ fontSize: 16, color: '#637381' }} />
          </IconButton>
        </Box>
      </Box>

      {/* Name + dims */}
      <Box sx={{ px: 2, mt: 1 }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 600, color: '#1a2332', lineHeight: 1.3 }}>
          {area.name}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.63)', fontFamily: '"Roboto Mono", monospace', mt: 0.25 }}>
          {area.cols} x {area.rows} cells
        </Typography>
      </Box>

      {/* Utilised cells */}
      <Box sx={{ px: 2, mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.875rem', fontFamily: '"Roboto Mono", monospace', color: '#1a2332' }}>
          {area.utilisedCells}/{area.totalCells}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', fontFamily: '"Roboto Mono", monospace', color: '#1a2332' }}>
          Utilised cells
        </Typography>
      </Box>

      {/* Progress bar */}
      <Box sx={{ px: 2, pb: 2, mt: 1 }}>
        <Box sx={{ height: 4, borderRadius: 2, bgcolor: '#e0e0e0', overflow: 'hidden' }}>
          <Box sx={{ height: '100%', width: `${pct}%`, borderRadius: 2, bgcolor: color }} />
        </Box>
      </Box>
    </Box>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function StagingAreaPage({ embedded }: { embedded?: boolean }) {
  const [filter, setFilter] = useState<FilterTab>('All');
  const [selectedArea, setSelectedArea] = useState<StagingArea | null>(null);

  const filtered = mockStagingAreas.filter((a) => {
    if (filter === 'Active') return a.active;
    if (filter === 'Inactive') return !a.active;
    return true;
  });

  if (selectedArea) {
    return <DetailView area={selectedArea} onBack={() => setSelectedArea(null)} />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Filter tab bar */}
      <Box sx={{ borderBottom: '1px solid #e0e0e0', flexShrink: 0, bgcolor: '#fff' }}>
        <Box sx={{ display: 'flex', px: 2, gap: 0 }}>
          {(['All', 'Active', 'Inactive'] as FilterTab[]).map((tab) => (
            <Box
              key={tab}
              onClick={() => setFilter(tab)}
              sx={{
                px: 1.5, py: 1.5, cursor: 'pointer', position: 'relative',
                fontSize: '1rem', fontWeight: 500, color: '#1a2332',
                borderBottom: filter === tab ? `2px solid ${PRIMARY}` : '2px solid transparent',
                '&:hover': { color: PRIMARY },
              }}
            >
              {tab}
            </Box>
          ))}
        </Box>
      </Box>

      {/* Cards grid */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2.5 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
          {filtered.map((area, idx) => (
            <StagingAreaCard
              key={area.id}
              area={area}
              color={CARD_COLORS[idx % CARD_COLORS.length]}
              onClick={() => setSelectedArea(area)}
            />
          ))}
          {filtered.length === 0 && (
            <Typography sx={{ color: '#9EA8B3', fontSize: '0.875rem', mt: 2 }}>
              No staging areas found
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
