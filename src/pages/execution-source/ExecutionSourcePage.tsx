import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import InputBase from '@mui/material/InputBase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddSourceDialog from './AddSourceDialog';
import { mockExecutionSources, mockProcessingAreas } from '../../data/mock';
import type { ExecutionSource, ExecutionSourceType, SupervisorSource } from '../../types';
import { PRIMARY } from '../../theme';

const TABS: { label: string; type: ExecutionSourceType }[] = [
  { label: 'Requester Device', type: 'requester' },
  { label: 'MES', type: 'mes' },
  { label: 'Dispatcher Device', type: 'dispatcher' },
  { label: 'Supervisor Device', type: 'supervisor' },
];

const thCellSx = {
  bgcolor: '#f8f9fa',
  borderBottom: '2px solid #e8ecef',
  fontWeight: 600,
  fontSize: '0.8125rem',
  color: '#1a2332',
  py: '14px',
};

const tdRowSx = {
  '&:not(:last-child) td': { borderBottom: '1px solid #f0f3f5' },
  '&:hover': { bgcolor: '#fafbfc' },
};

// ─── Requester Device Table ───────────────────────────────────────────────────

function RequesterTable({
  sources, onEdit, onDelete,
}: { sources: Extract<ExecutionSource, { type: 'requester' }>[]; onEdit: (s: ExecutionSource) => void; onDelete: (id: string) => void }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...thCellSx, pl: 2 }}>Device Name</TableCell>
          <TableCell sx={thCellSx}>Device ID</TableCell>
          <TableCell sx={thCellSx}>Username</TableCell>
          <TableCell sx={{ ...thCellSx, textAlign: 'center' }}>UI Mode</TableCell>
          <TableCell sx={{ ...thCellSx, textAlign: 'center' }}>Bound Workflows</TableCell>
          <TableCell sx={{ ...thCellSx, textAlign: 'center' }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sources.map((s) => (
          <TableRow key={s.id} sx={tdRowSx}>
            <TableCell sx={{ fontWeight: 500, fontSize: '0.8125rem', color: '#1a2332', pl: 2, py: '15px' }}>{s.name}</TableCell>
            <TableCell sx={{ fontSize: '0.8125rem', color: '#637381', py: '15px' }}>{s.deviceId}</TableCell>
            <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: '15px' }}>{s.username}</TableCell>
            <TableCell sx={{ py: '12px', textAlign: 'center' }}>
              <Chip
                label={s.uiMode === 'structured' ? 'Structured' : 'Legacy'}
                size="small"
                sx={{
                  bgcolor: s.uiMode === 'structured' ? '#e8f5e9' : '#f5f7f9',
                  color: s.uiMode === 'structured' ? '#2e7d32' : '#1a2332',
                  fontWeight: 500,
                  fontSize: '0.6875rem',
                  height: 24,
                  borderRadius: '4px',
                  '& .MuiChip-label': { px: '8px' },
                }}
              />
            </TableCell>
            <TableCell sx={{ fontSize: '0.75rem', color: '#637381', textAlign: 'center', py: '15px' }}>
              {s.boundWorkflows.length} workflow{s.boundWorkflows.length !== 1 ? 's' : ''}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', py: '10px' }}>
              <IconButton size="small" onClick={() => onEdit(s)} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <EditOutlinedIcon sx={{ fontSize: 17, color: '#637381' }} />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(s.id)} sx={{ '&:hover': { bgcolor: '#fff5f5' } }}>
                <DeleteOutlineIcon sx={{ fontSize: 17, color: '#e53935' }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── MES Table ────────────────────────────────────────────────────────────────

function MESTable({
  sources, onEdit, onDelete,
}: { sources: Extract<ExecutionSource, { type: 'mes' }>[]; onEdit: (s: ExecutionSource) => void; onDelete: (id: string) => void }) {
  const wfName = (id: string) => mockProcessingAreas.find((a) => a.id === id)?.name ?? id;
  void wfName;
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...thCellSx, pl: 2 }}>Mapping Name</TableCell>
          <TableCell sx={thCellSx}>Material Code</TableCell>
          <TableCell sx={thCellSx}>Config Params</TableCell>
          <TableCell sx={thCellSx}>Bound Workflow</TableCell>
          <TableCell sx={{ ...thCellSx, textAlign: 'center' }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sources.map((s) => (
          <TableRow key={s.id} sx={tdRowSx}>
            <TableCell sx={{ fontWeight: 500, fontSize: '0.8125rem', color: '#1a2332', pl: 2, py: '15px' }}>{s.name}</TableCell>
            <TableCell sx={{ fontSize: '0.8125rem', color: '#637381', fontFamily: 'monospace', py: '15px' }}>{s.materialCode || '—'}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', color: '#637381', py: '15px' }}>
              {s.keyValuePairs.length > 0 ? `${s.keyValuePairs.length} param${s.keyValuePairs.length !== 1 ? 's' : ''}` : '—'}
            </TableCell>
            <TableCell sx={{ fontSize: '0.8125rem', color: '#637381', py: '15px' }}>{s.boundWorkflow}</TableCell>
            <TableCell sx={{ textAlign: 'center', py: '10px' }}>
              <IconButton size="small" onClick={() => onEdit(s)} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <EditOutlinedIcon sx={{ fontSize: 17, color: '#637381' }} />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(s.id)} sx={{ '&:hover': { bgcolor: '#fff5f5' } }}>
                <DeleteOutlineIcon sx={{ fontSize: 17, color: '#e53935' }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── Supervisor Table ─────────────────────────────────────────────────────────

function SupervisorTable({
  sources, onEdit, onDelete,
}: { sources: SupervisorSource[]; onEdit: (s: ExecutionSource) => void; onDelete: (id: string) => void }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...thCellSx, pl: 2 }}>Device Name</TableCell>
          <TableCell sx={thCellSx}>Device ID</TableCell>
          <TableCell sx={thCellSx}>Username</TableCell>
          <TableCell sx={{ ...thCellSx, textAlign: 'center' }}>Staging Areas</TableCell>
          <TableCell sx={{ ...thCellSx, textAlign: 'center' }}>Inventory Areas</TableCell>
          <TableCell sx={{ ...thCellSx, textAlign: 'center' }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sources.map((s) => (
          <TableRow key={s.id} sx={tdRowSx}>
            <TableCell sx={{ fontWeight: 500, fontSize: '0.8125rem', color: '#1a2332', pl: 2, py: '15px' }}>{s.name}</TableCell>
            <TableCell sx={{ fontSize: '0.8125rem', color: '#637381', py: '15px' }}>{s.deviceId}</TableCell>
            <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: '15px' }}>{s.username}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', color: '#637381', textAlign: 'center', py: '15px' }}>
              {s.visibleStagingAreas.length} area{s.visibleStagingAreas.length !== 1 ? 's' : ''}
            </TableCell>
            <TableCell sx={{ fontSize: '0.75rem', color: '#637381', textAlign: 'center', py: '15px' }}>
              {s.inventoryAreas.length} area{s.inventoryAreas.length !== 1 ? 's' : ''}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', py: '10px' }}>
              <IconButton size="small" onClick={() => onEdit(s)} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <EditOutlinedIcon sx={{ fontSize: 17, color: '#637381' }} />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(s.id)} sx={{ '&:hover': { bgcolor: '#fff5f5' } }}>
                <DeleteOutlineIcon sx={{ fontSize: 17, color: '#e53935' }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── Dispatcher Table ─────────────────────────────────────────────────────────

function DispatcherTable({
  sources, onEdit, onDelete,
}: { sources: Extract<ExecutionSource, { type: 'dispatcher' }>[]; onEdit: (s: ExecutionSource) => void; onDelete: (id: string) => void }) {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell sx={{ ...thCellSx, pl: 2 }}>Dispatcher Name</TableCell>
          <TableCell sx={thCellSx}>Device ID</TableCell>
          <TableCell sx={thCellSx}>Username</TableCell>
          <TableCell sx={thCellSx}>Bound Stations</TableCell>
          <TableCell sx={{ ...thCellSx, textAlign: 'center' }}>Action</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sources.map((s) => (
          <TableRow key={s.id} sx={tdRowSx}>
            <TableCell sx={{ fontWeight: 500, fontSize: '0.8125rem', color: '#1a2332', pl: 2, py: '15px' }}>{s.name}</TableCell>
            <TableCell sx={{ fontSize: '0.8125rem', color: '#637381', py: '15px' }}>{s.deviceId}</TableCell>
            <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: '15px' }}>{s.username}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', color: '#637381', py: '15px' }}>{s.boundStations.join(', ')}</TableCell>
            <TableCell sx={{ textAlign: 'center', py: '10px' }}>
              <IconButton size="small" onClick={() => onEdit(s)} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                <EditOutlinedIcon sx={{ fontSize: 17, color: '#637381' }} />
              </IconButton>
              <IconButton size="small" onClick={() => onDelete(s.id)} sx={{ '&:hover': { bgcolor: '#fff5f5' } }}>
                <DeleteOutlineIcon sx={{ fontSize: 17, color: '#e53935' }} />
              </IconButton>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExecutionSourcePage() {
  const [sources, setSources] = useState<ExecutionSource[]>(mockExecutionSources);
  const [search, setSearch] = useState('');
  const [tabIdx, setTabIdx] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editSource, setEditSource] = useState<ExecutionSource | null>(null);

  const activeType = TABS[tabIdx].type;
  const filtered = sources.filter((s) => {
    if (s.type !== activeType) return false;
    const q = search.toLowerCase();
    if (s.type === 'requester') return s.name.toLowerCase().includes(q) || s.deviceId.toLowerCase().includes(q);
    if (s.type === 'mes') return s.name.toLowerCase().includes(q);
    if (s.type === 'supervisor') return s.name.toLowerCase().includes(q) || s.deviceId.toLowerCase().includes(q);
    return s.name.toLowerCase().includes(q);
  });

  const handleSave = (data: Omit<ExecutionSource, 'id'>) => {
    if (editSource) {
      setSources((p) => p.map((s) => s.id === editSource.id ? { ...data, id: editSource.id } as ExecutionSource : s));
    } else {
      setSources((p) => [...p, { ...data, id: `es-${Date.now()}` } as ExecutionSource]);
    }
    setDialogOpen(false);
    setEditSource(null);
  };

  const handleDelete = (id: string) => setSources((p) => p.filter((s) => s.id !== id));

  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Page header ─────────────────────────────────── */}
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e8ecef', px: 3, pt: 2, pb: 1.5, flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1a2332' }}>
          Execution Source Config
        </Typography>
      </Box>

      {/* ── Source type tabs ─────────────────────────────── */}
      <Box sx={{ bgcolor: '#fff', borderBottom: '1px solid #e8ecef', flexShrink: 0 }}>
        <Tabs
          value={tabIdx}
          onChange={(_, v) => { setTabIdx(v); setPage(0); }}
          sx={{
            px: 2,
            minHeight: 44,
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              minHeight: 44,
              py: 0,
              color: '#637381',
              '&.Mui-selected': { color: PRIMARY, fontWeight: 600 },
            },
            '& .MuiTabs-indicator': { bgcolor: PRIMARY },
          }}
        >
          {TABS.map((t) => <Tab key={t.type} label={t.label} disableRipple />)}
        </Tabs>
      </Box>

      {/* ── Content ─────────────────────────────────────── */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2.5, bgcolor: 'background.default', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* Search + ADD NEW row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {/* Search */}
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            bgcolor: '#fff', border: '1px solid #dde1e6', borderRadius: '8px',
            px: 1.5, height: 34, width: 280, flexShrink: 0,
          }}>
            <SearchIcon sx={{ fontSize: 16, color: '#9ea8b3', flexShrink: 0 }} />
            <InputBase
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ fontSize: '0.875rem', flex: 1, color: '#1a2332' }}
            />
          </Box>

          {/* Filter button */}
          <Box sx={{
            border: '1px solid #dde1e6', borderRadius: '8px',
            width: 34, height: 34,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', bgcolor: '#fff',
            '&:hover': { bgcolor: '#f5f5f5' },
          }}>
            <FilterListOutlinedIcon sx={{ fontSize: 18, color: '#637381' }} />
          </Box>

          <Box sx={{ flex: 1 }} />

          {/* ADD NEW */}
          <Button
            variant="contained"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={() => { setEditSource(null); setDialogOpen(true); }}
            disableElevation
            sx={{
              bgcolor: '#009688',
              color: '#fff',
              borderRadius: '6px',
              height: 44,
              px: 2.5,
              textTransform: 'none',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.26px',
              '&:hover': { bgcolor: '#00877a' },
            }}
          >
            ADD NEW
          </Button>
        </Box>

        {/* Table card */}
        <Box sx={{ border: '1px solid #e8ecef', borderRadius: '9px', overflow: 'hidden', bgcolor: '#fff', display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flex: 1 }}>
            {activeType === 'requester' && (
              <RequesterTable
                sources={paginated.filter((s): s is Extract<ExecutionSource, { type: 'requester' }> => s.type === 'requester')}
                onEdit={(s) => { setEditSource(s); setDialogOpen(true); }}
                onDelete={handleDelete}
              />
            )}
            {activeType === 'mes' && (
              <MESTable
                sources={paginated.filter((s): s is Extract<ExecutionSource, { type: 'mes' }> => s.type === 'mes')}
                onEdit={(s) => { setEditSource(s); setDialogOpen(true); }}
                onDelete={handleDelete}
              />
            )}
            {activeType === 'supervisor' && (
              <SupervisorTable
                sources={paginated.filter((s): s is SupervisorSource => s.type === 'supervisor')}
                onEdit={(s) => { setEditSource(s); setDialogOpen(true); }}
                onDelete={handleDelete}
              />
            )}
            {activeType === 'dispatcher' && (
              <DispatcherTable
                sources={paginated.filter((s): s is Extract<ExecutionSource, { type: 'dispatcher' }> => s.type === 'dispatcher')}
                onEdit={(s) => { setEditSource(s); setDialogOpen(true); }}
                onDelete={handleDelete}
              />
            )}
          </TableContainer>

          {filtered.length === 0 && (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <Typography sx={{ fontSize: '0.875rem', color: '#9ea8b3' }}>No records found</Typography>
            </Box>
          )}

          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[10]}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
            sx={{
              borderTop: '1px solid #e8ecef',
              fontSize: '0.8125rem',
              color: '#1a2332',
              '& .MuiTablePagination-displayedRows': { fontSize: '0.8125rem', color: '#1a2332' },
            }}
          />
        </Box>
      </Box>

      <AddSourceDialog
        open={dialogOpen}
        type={activeType}
        source={editSource}
        onClose={() => { setDialogOpen(false); setEditSource(null); }}
        onSave={handleSave}
      />
    </Box>
  );
}
