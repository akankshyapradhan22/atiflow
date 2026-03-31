import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SearchIcon from '@mui/icons-material/Search';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import { PRIMARY } from '../../theme';

interface WipEntry {
  id: string;
  sku: number;
  skuCode: string;
  productionUnit: string;
  qty: number;
  inTransit: number;
  processed: number;
  preProcessed: number;
  uom: string;
}

interface MheRecord {
  mheNumber: string;
  timeOfProduction: string;
  qty: number;
}

interface WipDetail {
  materialName: string;
  unitSection: string;
  uom: string;
  records: MheRecord[];
}

const MOCK_WIP: WipEntry[] = [
  { id: '1', sku: 20, skuCode: 'SKU-SMD-001', productionUnit: 'ROTR', qty: 50,  inTransit: 5,  processed: 30, preProcessed: 10, uom: 'PCS' },
  { id: '2', sku: 21, skuCode: 'SKU-SMD-002', productionUnit: 'ROTR', qty: 30,  inTransit: 2,  processed: 20, preProcessed: 8,  uom: 'PCS' },
  { id: '3', sku: 22, skuCode: 'SKU-PBA-001', productionUnit: 'TBM',  qty: 100, inTransit: 10, processed: 70, preProcessed: 15, uom: 'PCS' },
  { id: '4', sku: 23, skuCode: 'SKU-PBA-002', productionUnit: 'TBM',  qty: 45,  inTransit: 3,  processed: 35, preProcessed: 5,  uom: 'PCS' },
  { id: '5', sku: 24, skuCode: 'SKU-MECH-001', productionUnit: 'ROTR', qty: 200, inTransit: 15, processed: 150, preProcessed: 30, uom: 'PCS' },
];

const MOCK_WIP_DETAILS: Record<string, WipDetail> = {
  '1': { materialName: 'Steel Plate Grade A', unitSection: 'Unit A - Section 3', uom: 'Kilograms (kg)', records: [{ mheNumber: 'MHE-45892', timeOfProduction: 'March 24, 2026 08:30 AM', qty: 1250 }, { mheNumber: 'MHE-45893', timeOfProduction: 'March 24, 2026 09:15 AM', qty: 850 }, { mheNumber: 'MHE-45894', timeOfProduction: 'March 24, 2026 10:00 AM', qty: 2100 }] },
  '2': { materialName: 'SMD Component B', unitSection: 'Unit A - Section 1', uom: 'Pieces (pcs)', records: [{ mheNumber: 'MHE-45895', timeOfProduction: 'March 24, 2026 07:00 AM', qty: 300 }, { mheNumber: 'MHE-45896', timeOfProduction: 'March 24, 2026 11:00 AM', qty: 500 }] },
  '3': { materialName: 'PCB Assembly A', unitSection: 'Unit B - Section 2', uom: 'Pieces (pcs)', records: [{ mheNumber: 'MHE-45897', timeOfProduction: 'March 24, 2026 06:00 AM', qty: 1000 }, { mheNumber: 'MHE-45898', timeOfProduction: 'March 24, 2026 12:00 PM', qty: 750 }] },
  '4': { materialName: 'PCB Assembly B', unitSection: 'Unit B - Section 4', uom: 'Pieces (pcs)', records: [{ mheNumber: 'MHE-45899', timeOfProduction: 'March 24, 2026 08:00 AM', qty: 450 }] },
  '5': { materialName: 'Mechanical Part 001', unitSection: 'Unit C - Section 1', uom: 'Pieces (pcs)', records: [{ mheNumber: 'MHE-45900', timeOfProduction: 'March 24, 2026 07:30 AM', qty: 2000 }, { mheNumber: 'MHE-45901', timeOfProduction: 'March 24, 2026 09:00 AM', qty: 1800 }, { mheNumber: 'MHE-45902', timeOfProduction: 'March 24, 2026 11:30 AM', qty: 950 }] },
};

const HEAD = ['SKU', 'SKU Code', 'Production Unit', 'Qty', 'In Transit', 'Processed', 'Pre-processed', 'UOM', ''];

export default function WIPInventoryPage() {
  const [search, setSearch] = useState('');
  const [detailRow, setDetailRow] = useState<WipEntry | null>(null);
  const [manageRow, setManageRow] = useState<WipEntry | null>(null);
  const [subSku, setSubSku] = useState('');
  const [skuCode, setSkuCode] = useState('');
  const [mheCode, setMheCode] = useState('');

  const handleManageClose = () => {
    setManageRow(null);
    setSubSku('');
    setSkuCode('');
    setMheCode('');
  };

  const canSave = subSku.trim() !== '' && skuCode.trim() !== '' && mheCode.trim() !== '';

  const filtered = MOCK_WIP.filter((e) =>
    e.skuCode.toLowerCase().includes(search.toLowerCase()) ||
    e.productionUnit.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box sx={{ px: 2.5, py: 1.75, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <OutlinedInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search SKU"
          size="small"
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: '#9EA8B3' }} />
            </InputAdornment>
          }
          sx={{
            width: 260,
            fontSize: '0.8125rem',
            height: 40,
            borderRadius: '6px',
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e8e8e8' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#c0c0c0' },
            '& .MuiOutlinedInput-root': { borderRadius: '6px' },
            '& input::placeholder': { opacity: 0.41 },
          }}
        />
      </Box>

      {/* Table */}
      <TableContainer sx={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {HEAD.map((h) => (
                <TableCell
                  key={h}
                  sx={{
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: '#1a2332',
                    bgcolor: 'rgba(0,0,0,0.05)',
                    borderBottom: '1px solid #e8e8e8',
                    py: 1.5,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} align="center" sx={{ py: 6, color: '#9EA8B3', fontSize: '0.875rem' }}>
                  No inventory records found
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  sx={{ '&:last-child td': { borderBottom: 0 }, '& td': { borderBottom: '1px solid #f0f0f0' } }}
                >
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {row.sku}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {row.skuCode}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {row.productionUnit}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {row.qty}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {row.inTransit}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {row.processed}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {row.preProcessed}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: 1.5 }}>
                    {row.uom}
                  </TableCell>
                  <TableCell align="right" sx={{ py: 1.5, whiteSpace: 'nowrap', pr: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.75 }}>
                      <IconButton
                        size="small"
                        sx={{ color: '#9EA8B3', p: 0.25 }}
                        onClick={() => setDetailRow(row)}
                      >
                        <InfoOutlinedIcon sx={{ fontSize: 17 }} />
                      </IconButton>
                      <Button
                        size="small"
                        onClick={() => setManageRow(row)}
                        sx={{
                          bgcolor: 'rgba(0,169,157,0.12)',
                          color: PRIMARY,
                          border: 'none',
                          borderRadius: '8px',
                          height: '30px',
                          pl: '10px',
                          pr: '12px',
                          textTransform: 'none',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          minWidth: 0,
                          boxShadow: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          '&:hover': { bgcolor: 'rgba(0,169,157,0.2)', boxShadow: 'none' },
                        }}
                      >
                        <GridViewOutlinedIcon sx={{ fontSize: 14 }} />
                        Manage
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* ── Adjust Inventory Dialog ──────────────────── */}
      <Dialog
        open={Boolean(manageRow)}
        onClose={handleManageClose}
        PaperProps={{ sx: { width: 600, maxWidth: 600, borderRadius: '10px', overflow: 'hidden' } }}
      >
        <DialogTitle
          sx={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: '#1a2332',
            px: 3,
            py: 0,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid #e8ecef',
          }}
        >
          Adjust Inventory
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: '16px !important', pb: 0 }}>
          {/* Row 1: Sub SKU + SKU Code */}
          <Box sx={{ display: 'flex', gap: '12px', mb: '16px' }}>
            <TextField
              placeholder="Sub SKU *"
              value={subSku}
              onChange={(e) => setSubSku(e.target.value)}
              size="small"
              sx={{
                width: 270,
                '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.875rem' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dde1e6' },
                '& input::placeholder': { color: 'rgba(99,115,129,0.5)', opacity: 1 },
              }}
            />
            <TextField
              placeholder="SKU Code *"
              value={skuCode}
              onChange={(e) => setSkuCode(e.target.value)}
              size="small"
              sx={{
                width: 193,
                '& .MuiOutlinedInput-root': { borderRadius: '6px', fontSize: '0.875rem' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dde1e6' },
                '& input::placeholder': { color: 'rgba(99,115,129,0.5)', opacity: 1 },
              }}
            />
          </Box>
          {/* Row 2: MHE Code (floating label) */}
          <TextField
            label="MHE Code"
            value={mheCode}
            onChange={(e) => setMheCode(e.target.value)}
            size="small"
            sx={{
              width: 270,
              mb: '16px',
              '& .MuiOutlinedInput-root': { borderRadius: '4px', fontSize: '0.875rem' },
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dde1e6' },
              '& .MuiInputLabel-root': { fontSize: '0.875rem', color: '#637381' },
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 0,
            height: 76,
            borderTop: '1px solid #e8ecef',
            gap: 1,
            justifyContent: 'flex-end',
          }}
        >
          <Button
            onClick={handleManageClose}
            sx={{
              color: '#1a2332',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.28px',
              textTransform: 'uppercase',
              px: 1.5,
              '&:hover': { bgcolor: 'transparent' },
            }}
          >
            Cancel
          </Button>
          <Button
            disabled={!canSave}
            sx={{
              bgcolor: canSave ? PRIMARY : 'rgba(0,0,0,0.12)',
              color: canSave ? '#fff' : 'rgba(0,0,0,0.26)',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.28px',
              textTransform: 'uppercase',
              borderRadius: '6px',
              height: 44,
              px: 2,
              boxShadow: 'none',
              '&:hover': { bgcolor: canSave ? PRIMARY : 'rgba(0,0,0,0.12)', boxShadow: 'none' },
              '&.Mui-disabled': { bgcolor: 'rgba(0,0,0,0.12)', color: 'rgba(0,0,0,0.26)' },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ── WIP Detail Dialog (info icon) ────────────── */}
      <Dialog
        open={Boolean(detailRow)}
        onClose={() => setDetailRow(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: '10px', overflow: 'hidden' } }}
      >
        {detailRow && (() => {
          const detail = MOCK_WIP_DETAILS[detailRow.id];
          return (
            <DialogContent sx={{ p: 0 }}>
              {/* Header */}
              <Box sx={{ px: 3, pt: '16px', pb: '20px', borderBottom: '1px solid #e8ecef' }}>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#1a2332', lineHeight: '24px' }}>
                  {detailRow.skuCode}
                </Typography>
                <Typography sx={{ fontSize: '0.875rem', color: '#637381', mt: '4px', lineHeight: '20px' }}>
                  {detail?.materialName ?? '—'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 3, mt: '8px' }}>
                  <Typography sx={{ fontSize: '0.8125rem' }}>
                    <Box component="span" sx={{ fontWeight: 500, color: '#637381' }}>Unit/Section: </Box>
                    <Box component="span" sx={{ fontWeight: 400, color: '#1a2332' }}>{detail?.unitSection ?? '—'}</Box>
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem' }}>
                    <Box component="span" sx={{ fontWeight: 500, color: '#637381' }}>UOM: </Box>
                    <Box component="span" sx={{ fontWeight: 400, color: '#1a2332' }}>{detail?.uom ?? detailRow.uom}</Box>
                  </Typography>
                </Box>
              </Box>
              {/* Table */}
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#637381', bgcolor: '#f9fafb', borderBottom: '1px solid #e8ecef', py: '13px', pl: 3, width: '34%' }}>MHE Number</TableCell>
                    <TableCell sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#637381', bgcolor: '#f9fafb', borderBottom: '1px solid #e8ecef', py: '13px', width: '50%' }}>Time of Production</TableCell>
                    <TableCell align="right" sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#637381', bgcolor: '#f9fafb', borderBottom: '1px solid #e8ecef', py: '13px', pr: 3, width: '16%' }}>Qty</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(detail?.records ?? []).map((rec) => (
                    <TableRow key={rec.mheNumber} sx={{ '& td': { borderBottom: '1px solid #e8ecef' }, '&:last-child td': { borderBottom: 0 } }}>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: '17.5px', pl: 3 }}>{rec.mheNumber}</TableCell>
                      <TableCell sx={{ fontSize: '0.8125rem', color: '#1a2332', py: '17.5px' }}>{rec.timeOfProduction}</TableCell>
                      <TableCell align="right" sx={{ fontSize: '0.8125rem', color: '#1a2332', py: '17.5px', pr: 3 }}>{rec.qty.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          );
        })()}
      </Dialog>
    </Box>
  );
}
