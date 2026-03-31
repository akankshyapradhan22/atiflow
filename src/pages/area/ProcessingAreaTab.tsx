import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
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
import { mockProcessingAreas } from '../../data/mock';
import { PRIMARY } from '../../theme';
import type { ProcessingArea } from '../../types';
import CreateAreaDialog from '../home/CreateAreaDialog';

const ROWS_PER_PAGE = 10;

const HEAD_CELLS = ['Area Name', 'Machine Name', 'Point Type', 'Action'];

export default function ProcessingAreaTab() {
  const [rows, setRows] = useState<ProcessingArea[]>(mockProcessingAreas);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editRow, setEditRow] = useState<ProcessingArea | null>(null);

  const filtered = rows.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    (r.machineName ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const paginated = filtered.slice(page * ROWS_PER_PAGE, page * ROWS_PER_PAGE + ROWS_PER_PAGE);

  const handleDelete = (id: string) => setRows((prev) => prev.filter((r) => r.id !== id));

  const handleSave = (name: string, machineName: string, pointType: string) => {
    if (editRow) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === editRow.id
            ? { ...r, name, machineName, pointType: pointType as ProcessingArea['pointType'] }
            : r
        )
      );
      setEditRow(null);
    } else {
      const newArea: ProcessingArea = {
        id: name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name,
        machineName,
        pointType: pointType as ProcessingArea['pointType'],
      };
      setRows((prev) => [newArea, ...prev]);
    }
    setAddOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box sx={{ px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <OutlinedInput
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          placeholder="Search Area"
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
          onClick={() => { setEditRow(null); setAddOpen(true); }}
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
          Add
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
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#9EA8B3', fontSize: '0.875rem' }}>
                  No processing areas found
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
                    {row.name}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.25 }}>
                    {row.machineName ?? '—'}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.25 }}>
                    {row.pointType ?? '—'}
                  </TableCell>
                  <TableCell sx={{ py: 1.25, textAlign: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() => { setEditRow(row); setAddOpen(true); }}
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
          sx={{
            fontSize: '0.8125rem',
            '& .MuiTablePagination-displayedRows': { fontSize: '0.8125rem' },
          }}
        />
      </Box>

      <CreateAreaDialog
        open={addOpen}
        onClose={() => { setAddOpen(false); setEditRow(null); }}
        onSave={handleSave}
        initialValues={
          editRow
            ? { name: editRow.name, machineName: editRow.machineName ?? '', pointType: editRow.pointType ?? '' }
            : undefined
        }
      />
    </Box>
  );
}
