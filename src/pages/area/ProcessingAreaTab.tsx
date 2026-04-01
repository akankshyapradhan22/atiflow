import { useState } from 'react';
import { useProcessingAreas } from '../../context/ProcessingAreasContext';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import { PRIMARY } from '../../theme';

const ROWS_PER_PAGE = 10;
const HEAD_CELLS = ['Machine Name', 'Point Type', 'Action'];

interface Machine {
  id: string;
  machineName: string;
  pointType: string;
}

const POINT_TYPES = ['Consumption Point', 'Production Point'];

function MachineDialog({
  open,
  onClose,
  onSave,
  initial,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (machineName: string, pointType: string) => void;
  initial?: { machineName: string; pointType: string };
}) {
  const [machineName, setMachineName] = useState(initial?.machineName ?? '');
  const [pointType, setPointType] = useState(initial?.pointType ?? '');

  const isEdit = Boolean(initial);
  const canSave = machineName.trim() !== '';

  const handleSave = () => {
    onSave(machineName.trim(), pointType);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332', pb: 1 }}>
        {isEdit ? 'Edit Machine' : 'Add Machine'}
      </DialogTitle>
      <DialogContent sx={{ pt: '8px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          autoFocus
          label="Machine Name"
          size="small"
          fullWidth
          value={machineName}
          onChange={(e) => setMachineName(e.target.value)}
          InputProps={{ sx: { borderRadius: '6px' } }}
        />
        <TextField
          select
          label="Point Type"
          size="small"
          fullWidth
          value={pointType}
          onChange={(e) => setPointType(e.target.value)}
          InputProps={{ sx: { borderRadius: '6px' } }}
        >
          <MenuItem value="">— Select —</MenuItem>
          {POINT_TYPES.map((pt) => (
            <MenuItem key={pt} value={pt}>{pt}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>Cancel</Button>
        <Button
          variant="contained"
          disableElevation
          disabled={!canSave}
          onClick={handleSave}
          sx={{ bgcolor: PRIMARY, textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#009188' } }}
        >
          {isEdit ? 'Save' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function ProcessingAreaTab({ areaId }: { areaId: string }) {
  const { machines: allMachines, addAreaMachine, updateAreaMachine, deleteAreaMachine } = useProcessingAreas();
  const machines: Machine[] = allMachines[areaId] ?? [];

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMachine, setEditMachine] = useState<Machine | null>(null);

  const filtered = machines.filter((m) =>
    m.machineName.toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE);

  const handleDelete = (id: string) => deleteAreaMachine(areaId, id);

  const handleSave = (machineName: string, pointType: string) => {
    if (editMachine) {
      updateAreaMachine(areaId, editMachine.id, { machineName, pointType });
    } else {
      addAreaMachine(areaId, { machineName, pointType });
    }
    setDialogOpen(false);
    setEditMachine(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box sx={{ px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <OutlinedInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search Machine"
          size="small"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: '#9EA8B3' }} />
            </InputAdornment>
          }
          sx={{
            width: 260,
            fontSize: '0.8125rem',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e8e8e8' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#c0c0c0' },
            height: 36,
          }}
        />
        <Box sx={{ flex: 1 }} />
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => { setEditMachine(null); setDialogOpen(true); }}
          sx={{
            bgcolor: PRIMARY,
            textTransform: 'none',
            fontSize: '0.8125rem',
            fontWeight: 600,
            px: 2,
            height: 36,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#009688', boxShadow: 'none' },
          }}
        >
          Add Machine
        </Button>
      </Box>

      {/* Table */}
      <TableContainer sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {HEAD_CELLS.map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#637381',
                    bgcolor: '#f9fafb',
                    borderBottom: '1px solid #e8e8e8',
                    py: 1.25,
                    whiteSpace: 'nowrap',
                    ...(h === 'Action' ? { width: 100, textAlign: 'center' } : {}),
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 6, color: '#9EA8B3', fontSize: '0.875rem' }}>
                  No machines found
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 }, '& td': { borderBottom: '1px solid #f0f0f0' } }}
                >
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1a2332', py: 1.25 }}>
                    {row.machineName}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.25 }}>
                    {row.pointType || '—'}
                  </TableCell>
                  <TableCell sx={{ py: 1.25, textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => { setEditMachine(row); setDialogOpen(true); }}
                      sx={{ color: '#637381', '&:hover': { color: PRIMARY } }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(row.id)}
                      sx={{ color: '#637381', '&:hover': { color: '#d32f2f' } }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box sx={{ flexShrink: 0, borderTop: '1px solid #e8e8e8' }}>
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          rowsPerPage={ROWS_PER_PAGE}
          rowsPerPageOptions={[]}
          onPageChange={(_, p) => setPage(p)}
          sx={{ fontSize: '0.8125rem', '& .MuiTablePagination-displayedRows': { fontSize: '0.8125rem' } }}
        />
      </Box>

      <MachineDialog
        open={dialogOpen}
        onClose={() => { setDialogOpen(false); setEditMachine(null); }}
        onSave={handleSave}
        initial={editMachine ? { machineName: editMachine.machineName, pointType: editMachine.pointType } : undefined}
      />
    </Box>
  );
}
