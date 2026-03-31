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
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Typography from '@mui/material/Typography';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import SearchIcon from '@mui/icons-material/Search';
import AddWorkflowDialog from './AddWorkflowDialog';
import { mockWorkflows } from '../../data/mock';
import type { Workflow } from '../../types';
import { PRIMARY } from '../../theme';

const btnOutlinedSx = {
  borderColor: '#e0e0e0',
  color: '#1a2332',
  fontWeight: 500,
  fontSize: '0.875rem',
  textTransform: 'none',
  px: 1.5,
  height: 40,
  gap: 0.75,
  '&:hover': { borderColor: '#bdbdbd', bgcolor: 'rgba(0,0,0,0.02)' },
};

const WORKFLOW_TYPE_LABEL: Record<string, string> = {
  material: 'Material',
  container: 'Container',
};

export default function WorkflowConfigPage({ embedded }: { embedded?: boolean }) {
  const [workflows, setWorkflows] = useState<Workflow[]>(mockWorkflows);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editWf, setEditWf] = useState<Workflow | null>(null);

  const filtered = workflows.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSave = (data: Omit<Workflow, 'id'>) => {
    if (editWf) {
      setWorkflows((p) => p.map((w) => w.id === editWf.id ? { ...data, id: editWf.id } : w));
    } else {
      setWorkflows((p) => [...p, { ...data, id: `wf-${Date.now()}` }]);
    }
    setDialogOpen(false);
    setEditWf(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box sx={{ px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <OutlinedInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search Workflow"
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
            height: 40,
          }}
        />
        <Box sx={{ flex: 1 }} />
        <Button variant="outlined" size="small" startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 18 }} />} sx={btnOutlinedSx}>
          Export CSV
        </Button>
        <Button variant="outlined" size="small" startIcon={<FileUploadOutlinedIcon sx={{ fontSize: 18 }} />} sx={btnOutlinedSx}>
          Bulk Upload
        </Button>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon sx={{ fontSize: 18 }} />}
          onClick={() => { setEditWf(null); setDialogOpen(true); }}
          sx={{
            bgcolor: PRIMARY,
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 600,
            height: 40,
            px: 2,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#009688', boxShadow: 'none' },
          }}
        >
          Add New Workflow
        </Button>
      </Box>

      {/* Table */}
      <Paper variant="outlined" sx={{ mx: 2.5, mb: 2.5, borderRadius: '12px', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {['Workflow Name', 'Production Unit', 'Workflow', 'Action'].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      color: '#637381',
                      bgcolor: '#f9fafb',
                      borderBottom: '1px solid #e8e8e8',
                      py: 1.5,
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
              {paginated.map((wf) => (
                <TableRow
                  key={wf.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 }, '& td': { borderBottom: '1px solid #f0f0f0' } }}
                >
                  <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 500, color: '#1a2332', py: 1.5 }}>
                    {wf.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {wf.productionUnit ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {WORKFLOW_TYPE_LABEL[wf.orderCategory] ?? '—'}
                  </TableCell>
                  <TableCell sx={{ py: 1.5, textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => { setEditWf(wf); setDialogOpen(true); }}
                      sx={{ color: '#637381', '&:hover': { color: PRIMARY } }}
                    >
                      <EditOutlinedIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setWorkflows((p) => p.filter((x) => x.id !== wf.id))}
                      sx={{ color: '#E53935', '&:hover': { color: '#b71c1c' } }}
                    >
                      <DeleteOutlineIcon sx={{ fontSize: 17 }} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#9EA8B3', fontSize: '0.875rem' }}>
                    No workflows found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ borderTop: '1px solid #e8e8e8', flexShrink: 0 }}>
          <TablePagination
            component="div"
            count={filtered.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[]}
            onPageChange={(_, p) => setPage(p)}
            labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
            sx={{ fontSize: '0.8125rem', '& .MuiTablePagination-displayedRows': { fontSize: '0.8125rem' } }}
          />
        </Box>
      </Paper>

      <AddWorkflowDialog
        open={dialogOpen}
        tab="requester"
        workflow={editWf}
        onClose={() => { setDialogOpen(false); setEditWf(null); }}
        onSave={handleSave}
      />
    </Box>
  );
}
