import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import AddContainerDialog from './AddContainerDialog';
import { mockContainers } from '../../data/mock';
import type { Container } from '../../types';

const CONTAINER_TYPES = ['All', 'Trolley', 'Pallet', 'Bin'];

const btnOutlinedSx = {
  borderColor: '#e0e0e0',
  color: '#1a2332',
  fontWeight: 500,
  fontSize: '0.875rem',
  textTransform: 'none',
  px: 1.25,
  py: 0.875,
  gap: 0.75,
  '&:hover': { borderColor: '#bdbdbd', bgcolor: 'rgba(0,0,0,0.02)' },
};
const btnContainedSx = {
  bgcolor: '#00a99d',
  color: '#fff',
  fontWeight: 500,
  fontSize: '0.875rem',
  textTransform: 'none',
  px: 1.25,
  py: 0.875,
  gap: 0.75,
  boxShadow: 'none',
  '&:hover': { bgcolor: '#009688', boxShadow: 'none' },
};

export default function ContainerConfigPage({ embedded }: { embedded?: boolean }) {
  const [containers, setContainers] = useState<Container[]>(mockContainers);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editContainer, setEditContainer] = useState<Container | null>(null);

  const filtered = containers.filter((c) =>
    (typeFilter === 'All' || c.type === typeFilter) &&
    (c.type.toLowerCase().includes(search.toLowerCase()) ||
      c.subType.toLowerCase().includes(search.toLowerCase()))
  );
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSave = (data: Omit<Container, 'id'>) => {
    if (editContainer) {
      setContainers((p) => p.map((c) => c.id === editContainer.id ? { ...data, id: editContainer.id } : c));
    } else {
      setContainers((p) => [...p, { ...data, id: `cnt-${Date.now()}` }]);
    }
    setDialogOpen(false);
    setEditContainer(null);
  };

  const actionButtons = (
    <>
      <Button variant="outlined" size="small" startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 20 }} />} sx={btnOutlinedSx}>
        Export CSV
      </Button>
      <Button variant="outlined" size="small" startIcon={<FileUploadOutlinedIcon sx={{ fontSize: 20 }} />} sx={btnOutlinedSx}>
        Bulk Upload
      </Button>
      <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 20 }} />} sx={btnContainedSx}
        onClick={() => { setEditContainer(null); setDialogOpen(true); }}>
        Add New Container
      </Button>
    </>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {!embedded && (
        <PageHeader title="Container Configuration" actions={actionButtons} />
      )}

      <Box sx={{ px: 3, py: 2.5, flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0, bgcolor: 'background.default' }}>
        <Box sx={{ mb: 2, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search Container"
            extra={
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Container Type</InputLabel>
                <Select value={typeFilter} label="Container Type" onChange={(e) => setTypeFilter(e.target.value)}>
                  {CONTAINER_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </Select>
              </FormControl>
            }
          />
          {embedded && (
            <Box sx={{ display: 'flex', gap: 1, ml: 'auto', flexShrink: 0 }}>
              {actionButtons}
            </Box>
          )}
        </Box>

        <Paper variant="outlined" sx={{ borderRadius: '13px', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flex: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 60 }}>Serial No.</TableCell>
                  <TableCell>Container Type</TableCell>
                  <TableCell>Container Sub-type</TableCell>
                  <TableCell>Container ID</TableCell>
                  <TableCell>Dimensions</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell sx={{ color: '#637381' }}>
                      {String(c.serialNo).padStart(2, '0')}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{c.type}</TableCell>
                    <TableCell>{c.subType}</TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#637381' }}>
                      {c.containerId}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{c.dimensions}</Typography>
                    </TableCell>
                    <TableCell>{c.qty}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => { setEditContainer(c); setDialogOpen(true); }}>
                        <EditOutlinedIcon sx={{ fontSize: 17, color: '#637381' }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => setContainers((p) => p.filter((x) => x.id !== c.id))}>
                        <DeleteOutlineIcon sx={{ fontSize: 17, color: '#E53935' }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                      No containers found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div" count={filtered.length} page={page}
            onPageChange={(_, p) => setPage(p)} rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
            rowsPerPageOptions={[5, 10, 25]}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
            sx={{ borderTop: '1px solid #E8ECEF' }}
          />
        </Paper>
      </Box>

      <AddContainerDialog
        open={dialogOpen} container={editContainer}
        onClose={() => { setDialogOpen(false); setEditContainer(null); }}
        onSave={handleSave}
      />
    </Box>
  );
}
