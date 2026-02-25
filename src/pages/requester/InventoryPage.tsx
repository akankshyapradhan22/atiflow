import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import { mockInventory } from '../../data/mock';
import { PRIMARY } from '../../theme';

interface StatCell {
  key: keyof typeof mockInventory[0];
  label: string;
  color?: string;
}

const COLUMNS: StatCell[] = [
  { key: 'sku', label: 'SKU' },
  { key: 'subSkuType', label: 'Sub-SKU Type' },
  { key: 'produced', label: 'Produced' },
  { key: 'preProcessing', label: 'Pre-Proc.' },
  { key: 'available', label: 'Available', color: PRIMARY },
  { key: 'reserved', label: 'Reserved', color: '#F57C00' },
  { key: 'inTransit', label: 'In Transit', color: '#1565C0' },
  { key: 'consumed', label: 'Consumed' },
  { key: 'total', label: 'Total' },
];

export default function InventoryPage() {
  const [search, setSearch] = useState('');

  const filtered = mockInventory.filter((row) => {
    const q = search.toLowerCase();
    return row.sku.toLowerCase().includes(q) || row.subSkuType.toLowerCase().includes(q);
  });

  const totals = filtered.reduce(
    (acc, row) => ({
      produced: acc.produced + row.produced,
      preProcessing: acc.preProcessing + row.preProcessing,
      available: acc.available + row.available,
      reserved: acc.reserved + row.reserved,
      inTransit: acc.inTransit + row.inTransit,
      consumed: acc.consumed + row.consumed,
      total: acc.total + row.total,
    }),
    { produced: 0, preProcessing: 0, available: 0, reserved: 0, inTransit: 0, consumed: 0, total: 0 }
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', flexShrink: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>Live Inventory</Typography>
        <Typography variant="caption" color="text.secondary">Real-time material availability for your workflow</Typography>
      </Box>

      {/* Summary chips */}
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 1.5, flexShrink: 0, flexWrap: 'wrap' }}>
        <Chip label={`${totals.available} Available`} size="small" sx={{ bgcolor: 'rgba(0,150,136,0.1)', color: PRIMARY, fontWeight: 600 }} />
        <Chip label={`${totals.reserved} Reserved`} size="small" sx={{ bgcolor: 'rgba(245,124,0,0.1)', color: '#F57C00', fontWeight: 600 }} />
        <Chip label={`${totals.inTransit} In Transit`} size="small" sx={{ bgcolor: 'rgba(21,101,192,0.1)', color: '#1565C0', fontWeight: 600 }} />
        <Chip label={`${totals.preProcessing} Pre-Processing`} size="small" sx={{ bgcolor: '#F5F5F5', color: 'text.secondary', fontWeight: 600 }} />
      </Box>

      {/* Search */}
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: 'background.default', flexShrink: 0 }}>
        <OutlinedInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by SKU name…"
          size="small"
          startAdornment={<InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment>}
          sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper', '& input': { py: '8px' } }}
        />
      </Box>

      {/* Table */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'hidden', px: 2.5, pb: 2 }}>
        <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
            <Table size="small" stickyHeader>
              <TableHead>
                <TableRow>
                  {COLUMNS.map((col) => (
                    <TableCell
                      key={col.key}
                      align={typeof mockInventory[0][col.key] === 'number' ? 'center' : 'left'}
                      sx={{ fontWeight: 700, color: col.color ?? 'text.primary', whiteSpace: 'nowrap' }}
                    >
                      {col.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((row, idx) => (
                  <TableRow key={idx} sx={{ '&:hover': { bgcolor: '#F9FAFB' } }}>
                    <TableCell sx={{ fontWeight: 500 }}>{row.sku}</TableCell>
                    <TableCell sx={{ color: 'text.secondary' }}>{row.subSkuType}</TableCell>
                    <TableCell align="center">{row.produced}</TableCell>
                    <TableCell align="center">
                      {row.preProcessing > 0 ? (
                        <Chip label={row.preProcessing} size="small" sx={{ fontSize: '0.7rem', bgcolor: '#F5F5F5', height: 20 }} />
                      ) : row.preProcessing}
                    </TableCell>
                    <TableCell align="center">
                      <Typography sx={{ fontWeight: 700, color: row.available > 0 ? PRIMARY : 'text.disabled', fontSize: '0.8125rem' }}>
                        {row.available}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {row.reserved > 0 ? (
                        <Chip label={row.reserved} size="small" sx={{ fontSize: '0.7rem', bgcolor: 'rgba(245,124,0,0.1)', color: '#F57C00', fontWeight: 600, height: 20 }} />
                      ) : <Typography sx={{ color: 'text.disabled', fontSize: '0.8125rem' }}>0</Typography>}
                    </TableCell>
                    <TableCell align="center">
                      {row.inTransit > 0 ? (
                        <Chip label={row.inTransit} size="small" sx={{ fontSize: '0.7rem', bgcolor: 'rgba(21,101,192,0.1)', color: '#1565C0', fontWeight: 600, height: 20 }} />
                      ) : <Typography sx={{ color: 'text.disabled', fontSize: '0.8125rem' }}>0</Typography>}
                    </TableCell>
                    <TableCell align="center" sx={{ color: 'text.secondary' }}>{row.consumed}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>{row.total}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filtered.length === 0 && (
            <Box sx={{ py: 5, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">No inventory data found</Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
