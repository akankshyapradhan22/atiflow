import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import LinearProgress from '@mui/material/LinearProgress';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import { mockStagingAreas } from '../../data/mock';
import type { StagingArea, StagingCell } from '../../types';

type TabValue = 'all' | 'active' | 'inactive';
type Mode = 'view' | 'manage';
type ListMode = 'card' | 'list';
type CellViewMode = 'grid' | 'list';
type GridOrientation = 'vertical' | 'horizontal';

const CELL_SIZE = 50;

function getRowLabel(idx: number): string {
  if (idx < 26) return String.fromCharCode(65 + idx);
  return 'A' + String.fromCharCode(65 + (idx - 26));
}
const CELL_GAP = 10;

function isActive(area: StagingArea): boolean {
  return area.cells.some(c => c.status === 'occupied');
}

// ─── Cell tooltip content ─────────────────────────────────────────────────────

function CellTooltip({ cell }: { cell: StagingCell }) {
  if (cell.status === 'empty') {
    return <span>Available</span>;
  }

  const parts = cell.material?.split(' – ') ?? [];
  const sku = parts[0];
  const subSku = parts[1];

  const statusLabel = cell.status === 'reserved' ? 'Reserved' : 'Occupied';

  return (
    <Box sx={{ p: '2px 2px', display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 120 }}>
      <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', mb: '2px' }}>
        {statusLabel}
      </Typography>
      {sku && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.65)' }}>SKU</Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: '#fff', fontWeight: 500 }}>{sku}</Typography>
        </Box>
      )}
      {subSku && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.65)' }}>Sub-SKU</Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: '#fff', fontWeight: 500 }}>{subSku}</Typography>
        </Box>
      )}
      {cell.trolleyId && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
          <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.65)' }}>Trolley</Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: '#fff', fontWeight: 500 }}>{cell.trolleyId}</Typography>
        </Box>
      )}
      {cell.status === 'occupied' && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: '2px', pt: '4px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.65)' }}>Qty</Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: '#fff', fontWeight: 500 }}>12 Units</Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Cell visual (50×50 from Figma) ──────────────────────────────────────────

function GridCell({
  cell,
  onClick,
}: {
  cell: StagingCell;
  onClick: () => void;
}) {
  if (cell.status === 'empty') {
    return (
      <Tooltip title={<CellTooltip cell={cell} />} placement="top" arrow>
        <Box
          onClick={onClick}
          sx={{
            width: '100%', height: CELL_SIZE,
            bgcolor: '#f5f5f5',
            border: '1px solid #c9c9c9',
            borderRadius: '9px',
            cursor: 'pointer',
            transition: 'all 0.12s',
            '&:hover': {
              bgcolor: 'rgba(0,150,136,0.08)',
              border: '1.5px solid #00a99d',
            },
          }}
        />
      </Tooltip>
    );
  }

  if (cell.status === 'reserved') {
    return (
      <Tooltip title={<CellTooltip cell={cell} />} placement="top" arrow>
        <Box
          onClick={onClick}
          sx={{
            width: '100%', height: CELL_SIZE,
            bgcolor: 'rgba(255,217,92,0.37)',
            border: '1px solid #ffa719',
            borderRadius: '9px',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.12s',
            '&:hover': { filter: 'brightness(0.95)' },
          }}
        >
          <Box sx={{ width: 14, height: 14, bgcolor: '#ffa719', transform: 'rotate(45deg)', borderRadius: '2px' }} />
        </Box>
      </Tooltip>
    );
  }

  // occupied
  return (
    <Tooltip title={<CellTooltip cell={cell} />} placement="top" arrow>
      <Box
        onClick={onClick}
        sx={{
          width: '100%', height: CELL_SIZE,
          bgcolor: 'rgba(255,33,33,0.2)',
          border: '2px solid #ff5c5c',
          borderRadius: '9px',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.12s',
          '&:hover': { filter: 'brightness(0.95)' },
        }}
      >
        <Box sx={{ width: 12, height: 12, bgcolor: '#ff5c5c', borderRadius: '14px' }} />
      </Box>
    </Tooltip>
  );
}

// ─── Edit panel (overlay, matches Frame 3 exactly) ────────────────────────────

interface EditState {
  cell: StagingCell;
  rowLetter: string;
  colNumber: number;
  cellState: string;
  sku: string;
  subSku: string;
  skuQty: string;
  subSkuQty: string;
}

function EditPanel({
  state,
  onClose,
}: {
  state: EditState;
  onClose: () => void;
}) {
  const [local, setLocal] = useState(state);

  return (
    <Box sx={{
      position: 'absolute', inset: 0, zIndex: 20,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <Paper elevation={0} sx={{
        bgcolor: '#fff',
        border: '1px solid #c6c6c6',
        borderRadius: '10px',
        boxShadow: '-3px 4px 19.6px 3px rgba(0,0,0,0.25)',
        width: 525,
        p: '24px 28px 20px',
        display: 'flex', flexDirection: 'column', gap: 2,
      }}>
        {/* Title row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '2rem', color: '#1A2332', lineHeight: 1.2, fontFamily: 'Inter, sans-serif' }}>
            Cell {local.rowLetter} - {local.colNumber}
          </Typography>
          <Button
            size="small"
            startIcon={<QrCodeScannerIcon sx={{ fontSize: 16 }} />}
            variant="outlined"
            sx={{
              textTransform: 'none', fontSize: '0.875rem', fontWeight: 500,
              color: 'rgba(26,35,50,0.74)', borderColor: '#c6c6c6',
              borderRadius: '8px', px: 1.5, py: 0.5, mt: 0.5,
              '&:hover': { borderColor: '#00a99d', color: '#00a99d' },
            }}
          >
            Scan QR
          </Button>
        </Box>

        {/* Cell State */}
        <Box>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.74)', mb: 0.75 }}>Cell State</Typography>
          <Select
            size="small"
            value={local.cellState}
            onChange={e => setLocal(s => ({ ...s, cellState: e.target.value }))}
            sx={{
              width: 148, fontSize: '0.875rem', borderRadius: '8px',
              bgcolor: 'rgba(0,169,157,0.13)',
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#009688' },
              '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00a99d' },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00a99d' },
            }}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="reserved">Reserved</MenuItem>
            <MenuItem value="blocked">Blocked</MenuItem>
          </Select>
        </Box>

        {/* Contains / Quantity headers */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.74)', flex: 1 }}>Contains</Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.74)', width: 111, flexShrink: 0 }}>Quantity</Typography>
        </Box>

        {/* SKU row */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{
            width: 86, height: 42, flexShrink: 0,
            bgcolor: '#f2f2f2', border: '1px solid #cacaca', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '0.875rem', color: 'rgba(26,35,50,0.74)' }}>
              SKU
            </Typography>
          </Box>
          <TextField
            size="small" placeholder="Enter SKU"
            value={local.sku}
            onChange={e => setLocal(s => ({ ...s, sku: e.target.value }))}
            sx={{
              flex: 1,
              '& .MuiInputBase-root': { height: 42, borderRadius: '8px', bgcolor: '#fff', fontSize: '0.875rem', fontFamily: '"IBM Plex Mono", monospace' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cacaca' },
            }}
          />
          <TextField
            size="small" placeholder="—" type="number"
            value={local.skuQty}
            onChange={e => setLocal(s => ({ ...s, skuQty: e.target.value }))}
            sx={{
              width: 111, flexShrink: 0,
              '& .MuiInputBase-root': { height: 42, borderRadius: '8px', bgcolor: '#fff', fontSize: '0.875rem' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cacaca' },
            }}
          />
        </Box>

        {/* Sub-SKU row */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{
            width: 86, height: 42, flexShrink: 0,
            bgcolor: '#f2f2f2', border: '1px solid #cacaca', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '0.75rem', color: 'rgba(26,35,50,0.74)' }}>
              Sub-SKU
            </Typography>
          </Box>
          <TextField
            size="small" placeholder="Enter Sub-SKU"
            value={local.subSku}
            onChange={e => setLocal(s => ({ ...s, subSku: e.target.value }))}
            sx={{
              flex: 1,
              '& .MuiInputBase-root': { height: 42, borderRadius: '8px', bgcolor: '#fff', fontSize: '0.875rem', fontFamily: '"IBM Plex Mono", monospace' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cacaca' },
            }}
          />
          <TextField
            size="small" placeholder="—" type="number"
            value={local.subSkuQty}
            onChange={e => setLocal(s => ({ ...s, subSkuQty: e.target.value }))}
            sx={{
              width: 111, flexShrink: 0,
              '& .MuiInputBase-root': { height: 42, borderRadius: '8px', bgcolor: '#fff', fontSize: '0.875rem' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cacaca' },
            }}
          />
        </Box>

        {/* Cancel / Save */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 4, pt: 0.5 }}>
          <Button
            onClick={onClose}
            sx={{ color: '#ff5c5c', fontWeight: 500, fontSize: '1.25rem', textTransform: 'none', minWidth: 0, p: 0, '&:hover': { bgcolor: 'transparent', opacity: 0.8 } }}
          >
            Cancel
          </Button>
          <Button
            onClick={onClose}
            sx={{ color: '#00a99d', fontWeight: 500, fontSize: '1.25rem', textTransform: 'none', minWidth: 0, p: 0, '&:hover': { bgcolor: 'transparent', opacity: 0.8 } }}
          >
            Save
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

// ─── SA detail — grid cell view ───────────────────────────────────────────────

function SAGridView({
  area,
  onCellClick,
  orientation,
}: {
  area: StagingArea;
  onCellClick: (cell: StagingCell, letter: string, num: number) => void;
  orientation: GridOrientation;
}) {
  const numRows = area.rows;   // 40 (A–AN)
  const numCols = area.cols;   // 5  (1–5)
  const isHorizontal = orientation === 'horizontal';

  // Horizontal: outer = cols (1–5), inner = rows (A–AN), fixed cell width, scrolls right
  // Vertical:   outer = rows (A–AN), inner = cols (1–5), 1fr cell width, fills width
  const outerCount = isHorizontal ? numCols : numRows;
  const innerCount = isHorizontal ? numRows : numCols;

  const gridCols = isHorizontal
    ? `${CELL_SIZE}px repeat(${innerCount}, ${CELL_SIZE}px)`
    : `${CELL_SIZE}px repeat(${innerCount}, 1fr)`;

  const getOuterLabel = (i: number) => isHorizontal ? String(i + 1) : getRowLabel(i);
  const getInnerLabel = (i: number) => isHorizontal ? getRowLabel(i) : String(i + 1);

  const findCell = (outerIdx: number, innerIdx: number) =>
    isHorizontal
      ? area.cells.find(c => c.col === outerIdx && c.row === innerIdx)
      : area.cells.find(c => c.row === outerIdx && c.col === innerIdx);

  const buildClickArgs = (outerIdx: number, innerIdx: number): [string, number] =>
    isHorizontal
      ? [getRowLabel(innerIdx), outerIdx + 1]
      : [getRowLabel(outerIdx), innerIdx + 1];

  return (
    <Box sx={{ overflow: 'auto', scrollbarGutter: 'stable', p: 2.5, flex: 1, minWidth: 0 }}>

      {/* Column headers */}
      <Box sx={{
        display: 'grid', gridTemplateColumns: gridCols,
        columnGap: `${CELL_GAP}px`, mb: `${CELL_GAP}px`,
        ...(isHorizontal ? { minWidth: 'max-content' } : {}),
      }}>
        <Box /> {/* spacer for label column */}
        {Array.from({ length: innerCount }, (_, i) => (
          <Box key={i} sx={{ textAlign: 'center' }}>
            <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.7)', fontFamily: '"Roboto Mono", monospace', fontWeight: 500 }}>
              {getInnerLabel(i)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Rows */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: `${CELL_GAP}px`, ...(isHorizontal ? { minWidth: 'max-content' } : {}) }}>
        {Array.from({ length: outerCount }, (_, outerIdx) => (
          <Box key={outerIdx} sx={{ display: 'grid', gridTemplateColumns: gridCols, columnGap: `${CELL_GAP}px` }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: CELL_SIZE }}>
              <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.7)', fontFamily: '"Roboto Mono", monospace', fontWeight: 500 }}>
                {getOuterLabel(outerIdx)}
              </Typography>
            </Box>
            {Array.from({ length: innerCount }, (_, innerIdx) => {
              const cell = findCell(outerIdx, innerIdx);
              if (!cell) {
                return <Box key={innerIdx} sx={{ height: CELL_SIZE, bgcolor: '#f5f5f5', border: '1px solid #c9c9c9', borderRadius: '9px' }} />;
              }
              const [letter, num] = buildClickArgs(outerIdx, innerIdx);
              return (
                <GridCell
                  key={innerIdx}
                  cell={cell}
                  onClick={() => onCellClick(cell, letter, num)}
                />
              );
            })}
          </Box>
        ))}
      </Box>

      {/* Legend */}
      <Box sx={{ display: 'flex', gap: 3.5, mt: 3, pl: `${CELL_SIZE + CELL_GAP}px` }}>
        {[
          { label: 'Available', bg: 'rgba(0,150,136,0.15)', border: '#009688' },
          { label: 'Reserved',  bg: 'rgba(255,217,92,0.37)', border: '#ffa719' },
          { label: 'Occupied',  bg: 'rgba(255,92,92,0.15)',  border: '#ff5c5c' },
        ].map(({ label, bg, border }) => (
          <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ width: 20, height: 20, flexShrink: 0, bgcolor: bg, border: `1px solid ${border}`, borderRadius: '6px' }} />
            <Typography sx={{ fontSize: '0.875rem', color: '#1A2332' }}>{label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

// ─── SA detail — list cell view ───────────────────────────────────────────────

const CELL_STATUS_CONFIG = {
  empty:    { label: 'Available', accentBg: 'rgba(0,150,136,0.18)',  badgeBg: 'rgba(0,150,136,0.12)',  badgeBorder: '#009688',  color: '#009688' },
  reserved: { label: 'Reserved',  accentBg: 'rgba(255,167,25,0.25)', badgeBg: 'rgba(255,217,92,0.24)', badgeBorder: '#ffa719',  color: '#ffa719' },
  occupied: { label: 'Occupied',  accentBg: 'rgba(255,92,92,0.22)',  badgeBg: 'rgba(255,92,92,0.14)',  badgeBorder: '#ff5c5c',  color: '#ff5c5c' },
};

const CELL_LIST_COLS = '72px 110px 1fr 1fr 110px 80px';

function SACellListView({
  area,
  onCellClick,
}: {
  area: StagingArea;
  onCellClick: (cell: StagingCell, letter: string, num: number) => void;
}) {
  // Sort cells: by col (letter) then row (number)
  const sorted = [...area.cells].sort((a, b) =>
    a.col !== b.col ? a.col - b.col : a.row - b.row
  );

  return (
    <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
      {/* Column headers */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: CELL_LIST_COLS,
        columnGap: '16px',
        pl: '43px', pr: '29px', py: 1,
        borderTop: '1px solid #f0f0f0',
        borderBottom: '1px solid #f0f0f0',
        flexShrink: 0,
      }}>
        {['Cell', 'Status', 'SKU', 'Sub-SKU', 'Trolley ID', 'Qty'].map(h => (
          <Typography key={h} sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332' }}>{h}</Typography>
        ))}
      </Box>

      {/* Rows */}
      <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {sorted.map(cell => {
          const letter = getRowLabel(cell.row);
          const num = cell.col + 1;
          const cfg = CELL_STATUS_CONFIG[cell.status];
          const parts = cell.material?.split(' – ') ?? [];
          const sku = parts[0] ?? '—';
          const subSku = parts[1] ?? '—';

          return (
            <Box
              key={cell.id}
              onClick={() => onCellClick(cell, letter, num)}
              sx={{
                display: 'flex',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                overflow: 'hidden',
                bgcolor: '#fff',
                cursor: 'pointer',
                minHeight: 48,
                transition: 'box-shadow 0.12s',
                '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
              }}
            >
              {/* Left accent bar */}
              <Box sx={{ width: 12, flexShrink: 0, bgcolor: cfg.accentBg }} />

              {/* Content */}
              <Box sx={{
                flex: 1,
                display: 'grid',
                gridTemplateColumns: CELL_LIST_COLS,
                columnGap: '16px',
                px: 1.5, py: 1.25,
                alignItems: 'center',
                minWidth: 0,
              }}>
                {/* Cell position */}
                <Typography sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontWeight: 600, fontSize: '0.875rem', color: '#1A2332',
                }}>
                  {letter}-{num}
                </Typography>

                {/* Status badge */}
                <Box sx={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  px: 1, py: '2px', borderRadius: '20px',
                  bgcolor: cfg.badgeBg, border: `1px solid ${cfg.badgeBorder}`,
                  width: 'fit-content',
                }}>
                  <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: '#1A2332', whiteSpace: 'nowrap' }}>
                    {cfg.label}
                  </Typography>
                </Box>

                {/* SKU */}
                <Typography sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '0.8125rem', color: cell.material ? '#1A2332' : 'rgba(26,35,50,0.35)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {cell.material ? sku : '—'}
                </Typography>

                {/* Sub-SKU */}
                <Typography sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '0.8125rem', color: cell.material && subSku !== '—' ? '#1A2332' : 'rgba(26,35,50,0.35)',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {cell.material && subSku !== '—' ? subSku : '—'}
                </Typography>

                {/* Trolley ID */}
                <Typography sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontSize: '0.8125rem', color: cell.trolleyId ? '#1A2332' : 'rgba(26,35,50,0.35)',
                }}>
                  {cell.trolleyId ?? '—'}
                </Typography>

                {/* Quantity */}
                <Typography sx={{
                  fontFamily: '"IBM Plex Mono", monospace',
                  fontWeight: cell.status === 'occupied' ? 700 : 400,
                  fontSize: '0.875rem',
                  color: cell.status === 'occupied' ? '#1A2332' : 'rgba(26,35,50,0.35)',
                }}>
                  {cell.status === 'occupied' ? '12' : '—'}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

// ─── SA list — Card view ───────────────────────────────────────────────────────

function SACard({ area, onClick }: { area: StagingArea; onClick: () => void }) {
  const total = area.rows * area.cols;
  const occupied = area.cells.filter(c => c.status === 'occupied').length;
  const reserved = area.cells.filter(c => c.status === 'reserved').length;
  const used = occupied + reserved;
  const active = isActive(area);
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;
  const accentColor = active ? '#009688' : '#ff726a';

  return (
    <Box
      onClick={onClick}
      sx={{
        bgcolor: '#fff',
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        boxShadow: `-3px 0px 0px 0px ${accentColor}`,
        p: '16px 16px 20px',
        width: { xs: '100%', sm: 270 },
        cursor: 'pointer',
        transition: 'box-shadow 0.15s',
        '&:hover': {
          boxShadow: `-3px 0px 0px 0px ${accentColor}, 0 3px 12px rgba(0,0,0,0.09)`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
        <Box sx={{
          border: '1px solid #e8e8e8', borderRadius: '7px',
          px: '5px', py: '2px', display: 'inline-flex',
        }}>
          <Typography sx={{ fontSize: '0.625rem', color: 'rgba(26,35,50,0.51)' }}>Updated 51 mins ago</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Box sx={{ width: 36, height: 36, bgcolor: '#f1f1f1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={e => e.stopPropagation()}>
            <EditOutlinedIcon sx={{ fontSize: 16, color: '#637381' }} />
          </Box>
          <Box sx={{ width: 36, height: 36, bgcolor: '#fff', borderRadius: '50%', border: '1px solid #e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            onClick={e => e.stopPropagation()}>
            <MoreVertIcon sx={{ fontSize: 16, color: '#637381' }} />
          </Box>
        </Box>
      </Box>

      <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#1A2332', lineHeight: 1.2, mb: 0.5 }}>
        {area.name}
      </Typography>
      <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.63)', fontFamily: '"Roboto Mono", monospace', mb: 2 }}>
        {area.rows} x {area.cols} cells
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.75 }}>
        <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"Roboto Mono", monospace', fontWeight: 500 }}>
          {used}/{total}
        </Typography>
        <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"Roboto Mono", monospace' }}>
          Utilised cells
        </Typography>
      </Box>
      <LinearProgress
        variant="determinate"
        value={pct}
        sx={{
          height: 5, borderRadius: 4, bgcolor: '#E0E0E0',
          '& .MuiLinearProgress-bar': { bgcolor: accentColor, borderRadius: 4 },
        }}
      />
    </Box>
  );
}

// ─── SA list — List row ────────────────────────────────────────────────────────

const LIST_COLS = '1fr 90px 100px 200px 44px';

function SAListRow({ area, onClick }: { area: StagingArea; onClick: () => void }) {
  const total = area.rows * area.cols;
  const occupied = area.cells.filter(c => c.status === 'occupied').length;
  const reserved = area.cells.filter(c => c.status === 'reserved').length;
  const used = occupied + reserved;
  const active = isActive(area);
  const pct = total > 0 ? Math.round((used / total) * 100) : 0;
  const accentColor = active ? '#009688' : '#ff726a';

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        border: '1px solid #e0e0e0',
        borderRadius: '13px',
        overflow: 'hidden',
        bgcolor: '#fff',
        cursor: 'pointer',
        '&:hover': { boxShadow: '0 2px 8px rgba(0,0,0,0.07)' },
      }}
    >
      {/* Left accent bar */}
      <Box sx={{ width: 14, flexShrink: 0, bgcolor: accentColor, opacity: 0.55 }} />

      {/* Content grid */}
      <Box sx={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: LIST_COLS,
        px: 2, py: 1.5,
        alignItems: 'center',
        gap: 1,
        minWidth: 0,
      }}>
        {/* Name + dimensions */}
        <Box>
          <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1A2332', lineHeight: 1.3 }}>
            {area.name}
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(26,35,50,0.55)', fontFamily: '"Roboto Mono", monospace', mt: 0.25 }}>
            {area.rows} × {area.cols} cells
          </Typography>
        </Box>

        {/* Status badge */}
        <Box sx={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          px: 1.25, py: '3px', borderRadius: '22px',
          bgcolor: active ? 'rgba(0,150,136,0.12)' : 'rgba(255,114,106,0.12)',
          border: `1px solid ${active ? '#009688' : '#ff726a'}`,
          width: 'fit-content',
        }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 500, color: '#1A2332', whiteSpace: 'nowrap' }}>
            {active ? 'Active' : 'Inactive'}
          </Typography>
        </Box>

        {/* Cell count */}
        <Box>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332', fontFamily: '"Roboto Mono", monospace' }}>
            {used}/{total}
          </Typography>
          <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(26,35,50,0.55)' }}>
            utilised
          </Typography>
        </Box>

        {/* Progress */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(26,35,50,0.55)' }}>Utilisation</Typography>
            <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color: '#1A2332' }}>{pct}%</Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={pct}
            sx={{
              height: 5, borderRadius: 4, bgcolor: '#E0E0E0',
              '& .MuiLinearProgress-bar': { bgcolor: accentColor, borderRadius: 4 },
            }}
          />
        </Box>

        {/* Open arrow */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ChevronRightIcon sx={{ fontSize: 20, color: 'rgba(26,35,50,0.4)' }} />
        </Box>
      </Box>
    </Box>
  );
}

// ─── View / Manage toggle ─────────────────────────────────────────────────────

function ViewManageToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center',
      bgcolor: '#f1f1f1', border: '1px solid #e0e0e0',
      borderRadius: '10px', p: '2px', gap: 0,
      width: { xs: 'auto', md: 200 }, height: 44,
    }}>
      <Button
        onClick={() => onChange('view')}
        startIcon={<VisibilityOutlinedIcon sx={{ fontSize: 18 }} />}
        sx={{
          flex: 1, height: 40, borderRadius: '8px',
          bgcolor: mode === 'view' ? '#fff' : 'transparent',
          border: mode === 'view' ? '1px solid #e0e0e0' : 'none',
          color: '#1A2332', fontWeight: 500, fontSize: '0.875rem',
          textTransform: 'none',
          '&:hover': { bgcolor: mode === 'view' ? '#fff' : 'rgba(0,0,0,0.04)' },
          minWidth: 0,
        }}
      >
        View
      </Button>
      <Button
        onClick={() => onChange('manage')}
        startIcon={<EditOutlinedIcon sx={{ fontSize: 18 }} />}
        sx={{
          flex: 1, height: 40, borderRadius: '8px',
          bgcolor: mode === 'manage' ? '#fff' : 'transparent',
          border: mode === 'manage' ? '1px solid #e0e0e0' : 'none',
          color: '#1A2332', fontWeight: 500, fontSize: '0.875rem',
          textTransform: 'none',
          '&:hover': { bgcolor: mode === 'manage' ? '#fff' : 'rgba(0,0,0,0.04)' },
          minWidth: 0,
        }}
      >
        Manage
      </Button>
    </Box>
  );
}

// ─── List / Card toggle ───────────────────────────────────────────────────────

function ListCardToggle({ listMode, onChange }: { listMode: ListMode; onChange: (m: ListMode) => void }) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center',
      bgcolor: '#e5e5e5', border: '1px solid #e0e0e0',
      borderRadius: '8px', p: '2px', gap: '2px', flexShrink: 0,
    }}>
      <Box
        onClick={() => onChange('list')}
        sx={{
          width: 34, height: 28, borderRadius: '6px', cursor: 'pointer',
          bgcolor: listMode === 'list' ? '#fff' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.15s',
          '&:hover': { bgcolor: listMode === 'list' ? '#fff' : 'rgba(0,0,0,0.06)' },
        }}
      >
        <FormatListBulletedIcon sx={{ fontSize: 18, color: '#1A2332' }} />
      </Box>
      <Box
        onClick={() => onChange('card')}
        sx={{
          width: 34, height: 28, borderRadius: '6px', cursor: 'pointer',
          bgcolor: listMode === 'card' ? '#fff' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background-color 0.15s',
          '&:hover': { bgcolor: listMode === 'card' ? '#fff' : 'rgba(0,0,0,0.06)' },
        }}
      >
        <GridViewIcon sx={{ fontSize: 18, color: '#1A2332' }} />
      </Box>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StagingAreaPage() {
  const [tab, setTab] = useState<TabValue>('all');
  const [listMode, setListMode] = useState<ListMode>('card');
  const [selectedArea, setSelectedArea] = useState<StagingArea | null>(null);
  const [mode, setMode] = useState<Mode>('view');
  const [cellViewMode, setCellViewMode] = useState<CellViewMode>('grid');
  const [gridOrientation, setGridOrientation] = useState<GridOrientation>('vertical');
  const [editState, setEditState] = useState<EditState | null>(null);

  const filtered = mockStagingAreas.filter(area => {
    if (tab === 'all') return true;
    if (tab === 'active') return isActive(area);
    return !isActive(area);
  });

  const handleCellClick = (cell: StagingCell, rowLetter: string, colNumber: number) => {
    setEditState({
      cell,
      rowLetter,
      colNumber,
      cellState: cell.status === 'empty' ? 'available' : cell.status === 'reserved' ? 'reserved' : 'blocked',
      sku: cell.material ?? '',
      subSku: '',
      skuQty: '',
      subSkuQty: '',
    });
  };

  const openArea = (area: StagingArea) => {
    setSelectedArea(area);
    setMode('view');
    setCellViewMode('grid');
    setGridOrientation('vertical');
    setEditState(null);
  };

  // ── SA Detail ──────────────────────────────────────────────────────────────

  if (selectedArea) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

          {/* Header */}
          <Box sx={{ px: 3, pt: 2, pb: 1.5, flexShrink: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.25 }}>
              <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>Station 001</Typography>
              <ChevronRightIcon sx={{ fontSize: 16, color: '#9E9E9E' }} />
              <Typography
                onClick={() => setSelectedArea(null)}
                sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500, cursor: 'pointer', '&:hover': { color: '#00a99d' } }}
              >
                Staging Area
              </Typography>
              <ChevronRightIcon sx={{ fontSize: 16, color: '#9E9E9E' }} />
              <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>
                {selectedArea.name}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', flexWrap: { xs: 'wrap', md: 'nowrap' }, gap: 1 }}>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '1.25rem', color: '#1A2332', lineHeight: 1.2 }}>
                  {selectedArea.name}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.63)', fontFamily: '"Roboto Mono", monospace', mt: 0.25 }}>
                  {selectedArea.rows} x {selectedArea.cols} cells
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexWrap: 'wrap' }}>
                {/* Grid / List toggle for cell view */}
                <Box sx={{
                  display: 'flex', alignItems: 'center',
                  bgcolor: '#e5e5e5', border: '1px solid #e0e0e0',
                  borderRadius: '8px', p: '2px', gap: '2px',
                }}>
                  <Box
                    onClick={() => setCellViewMode('grid')}
                    sx={{
                      width: 34, height: 28, borderRadius: '6px', cursor: 'pointer',
                      bgcolor: cellViewMode === 'grid' ? '#fff' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background-color 0.15s',
                      '&:hover': { bgcolor: cellViewMode === 'grid' ? '#fff' : 'rgba(0,0,0,0.06)' },
                    }}
                  >
                    <GridViewIcon sx={{ fontSize: 18, color: '#1A2332' }} />
                  </Box>
                  <Box
                    onClick={() => setCellViewMode('list')}
                    sx={{
                      width: 34, height: 28, borderRadius: '6px', cursor: 'pointer',
                      bgcolor: cellViewMode === 'list' ? '#fff' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background-color 0.15s',
                      '&:hover': { bgcolor: cellViewMode === 'list' ? '#fff' : 'rgba(0,0,0,0.06)' },
                    }}
                  >
                    <FormatListBulletedIcon sx={{ fontSize: 18, color: '#1A2332' }} />
                  </Box>
                </Box>

                {/* H / V orientation toggle — only for grid view */}
                {cellViewMode === 'grid' && (
                  <Box sx={{
                    display: 'flex', alignItems: 'center',
                    bgcolor: '#e5e5e5', border: '1px solid #e0e0e0',
                    borderRadius: '8px', p: '2px', gap: '2px',
                  }}>
                    {(['vertical', 'horizontal'] as const).map((o) => (
                      <Box
                        key={o}
                        onClick={() => setGridOrientation(o)}
                        sx={{
                          width: 34, height: 28, borderRadius: '6px', cursor: 'pointer',
                          bgcolor: gridOrientation === o ? '#fff' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'background-color 0.15s',
                          '&:hover': { bgcolor: gridOrientation === o ? '#fff' : 'rgba(0,0,0,0.06)' },
                        }}
                      >
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1A2332', lineHeight: 1 }}>
                          {o === 'vertical' ? 'V' : 'H'}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                )}

                <ViewManageToggle mode={mode} onChange={setMode} />
              </Box>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, position: 'relative', overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
            {cellViewMode === 'grid' ? (
              <SAGridView area={selectedArea} onCellClick={handleCellClick} orientation={gridOrientation} />
            ) : (
              <SACellListView area={selectedArea} onCellClick={handleCellClick} />
            )}
            {editState && (
              <EditPanel state={editState} onClose={() => setEditState(null)} />
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // ── SA List ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>

        {/* Header */}
        <Box sx={{ px: 3, pt: 2, pb: 0, flexShrink: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1A2332', mb: 1.5 }}>
            Staging Area
          </Typography>

          {/* Tabs + toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                minHeight: 38,
                '& .MuiTab-root': { minHeight: 38, fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', px: 1.5, textTransform: 'none' },
                '& .Mui-selected': { color: '#1A2332' },
                '& .MuiTabs-indicator': { bgcolor: '#00a99d', height: 2 },
              }}
            >
              <Tab value="all" label="All" />
              <Tab value="active" label="Active" />
              <Tab value="inactive" label="Inactive" />
            </Tabs>

            <ListCardToggle listMode={listMode} onChange={setListMode} />
          </Box>
        </Box>

        {/* Content */}
        {listMode === 'card' ? (
          /* Card view */
          <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', p: 3 }}>
            {filtered.length === 0 ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
                <Typography sx={{ color: '#9E9E9E', fontSize: '0.875rem' }}>No staging areas</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2.5 }}>
                {filtered.map(area => (
                  <SACard key={area.id} area={area} onClick={() => openArea(area)} />
                ))}
              </Box>
            )}
          </Box>
        ) : (
          /* List view */
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
            {/* Column headers */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: LIST_COLS,
              px: 3, pl: '43px', py: 1,
              borderTop: '1px solid #f0f0f0',
              borderBottom: '1px solid #f0f0f0',
              flexShrink: 0,
              gap: 1,
            }}>
              {['Staging Area', 'Status', 'Cells', 'Utilisation', ''].map(h => (
                <Typography key={h} sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A2332' }}>{h}</Typography>
              ))}
            </Box>

            {/* Rows */}
            <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
              {filtered.length === 0 ? (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 120 }}>
                  <Typography sx={{ color: '#9E9E9E', fontSize: '0.875rem' }}>No staging areas</Typography>
                </Box>
              ) : (
                filtered.map(area => (
                  <SAListRow key={area.id} area={area} onClick={() => openArea(area)} />
                ))
              )}
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
