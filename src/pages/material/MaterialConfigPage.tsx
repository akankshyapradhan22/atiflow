import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import PageHeader from '../../components/common/PageHeader';
import SearchBar from '../../components/common/SearchBar';
import { mockMatMaterials } from '../../data/mock';
import type { MatMaterial } from '../../types';
import AddMaterialDialog from './AddMaterialDialog';

const btnOutlinedSx = {
  borderColor: '#e0e0e0', color: '#1a2332', fontWeight: 500, fontSize: '0.875rem',
  textTransform: 'none', px: 1.25, py: 0.875, gap: 0.75,
  '&:hover': { borderColor: '#bdbdbd', bgcolor: 'rgba(0,0,0,0.02)' },
};
const btnContainedSx = {
  bgcolor: '#00a99d', color: '#fff', fontWeight: 500, fontSize: '0.875rem',
  textTransform: 'none', px: 1.25, py: 0.875, gap: 0.75, boxShadow: 'none',
  '&:hover': { bgcolor: '#009688', boxShadow: 'none' },
};

export default function MaterialConfigPage({ embedded }: { embedded?: boolean }) {
  const [materials, setMaterials] = useState<MatMaterial[]>(mockMatMaterials);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedMat, setExpandedMat] = useState<Set<string>>(new Set());
  const [expandedSku, setExpandedSku] = useState<Set<string>>(new Set());
  const [dialog, setDialog] = useState<{ open: boolean; edit?: MatMaterial }>({ open: false });

  const toggle = (set: Set<string>, setFn: React.Dispatch<React.SetStateAction<Set<string>>>, id: string) =>
    setFn((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const filtered = materials.filter((m) =>
    m.materialType.toLowerCase().includes(search.toLowerCase()) ||
    m.prefix.toLowerCase().includes(search.toLowerCase())
  );
  const paginated = filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleSave = (data: Omit<MatMaterial, 'id' | 'skus'>) => {
    if (dialog.edit) {
      setMaterials((p) => p.map((m) => m.id === dialog.edit!.id ? { ...m, ...data } : m));
    } else {
      setMaterials((p) => [...p, { ...data, id: `mat-${Date.now()}`, skus: [] }]);
    }
    setDialog({ open: false });
  };

  const headerActions = (
    <>
      <Button variant="outlined" size="small" startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 20 }} />} sx={btnOutlinedSx}>Export CSV</Button>
      <Button variant="outlined" size="small" startIcon={<FileUploadOutlinedIcon sx={{ fontSize: 20 }} />} sx={btnOutlinedSx}>Bulk Upload</Button>
      <Button variant="contained" size="small" startIcon={<AddIcon sx={{ fontSize: 20 }} />} sx={btnContainedSx}
        onClick={() => setDialog({ open: true })}>
        Add Material
      </Button>
    </>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {!embedded && <PageHeader title="Material Configuration" actions={headerActions} />}

      <Box sx={{ px: 3, py: 2.5, flexGrow: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0, bgcolor: 'background.default' }}>
        <Box sx={{ mb: 2, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search Material" />
          {embedded && <Box sx={{ display: 'flex', gap: 1, ml: 'auto', flexShrink: 0 }}>{headerActions}</Box>}
        </Box>

        <Paper variant="outlined" sx={{ borderRadius: '13px', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <TableContainer sx={{ flex: 1 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width={36} />
                  <TableCell>Material Type</TableCell>
                  <TableCell>Prefix</TableCell>
                  <TableCell>Pre-processing Time (min)</TableCell>
                  <TableCell>Max Qty</TableCell>
                  <TableCell>Staging Area</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginated.map((mat) => (
                  <>
                    {/* ── Level 1: Material Class ── */}
                    <TableRow key={mat.id} sx={{ '& td': { borderBottom: expandedMat.has(mat.id) ? 'none' : undefined } }}>
                      <TableCell padding="checkbox" sx={{ pl: 1 }}>
                        <IconButton size="small" onClick={() => toggle(expandedMat, setExpandedMat, mat.id)}>
                          {expandedMat.has(mat.id)
                            ? <KeyboardArrowDownIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                            : <KeyboardArrowRightIcon sx={{ fontSize: 18, color: '#9EA8B3' }} />}
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 500 }}>{mat.materialType}</TableCell>
                      <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#637381' }}>{mat.prefix}</TableCell>
                      <TableCell>{mat.preprocessingTime}</TableCell>
                      <TableCell>{mat.maxQty}</TableCell>
                      <TableCell sx={{ color: mat.stagingAreaEnabled ? '#2e7d32' : '#637381' }}>
                        {mat.stagingAreaEnabled ? 'Yes' : 'No'}
                      </TableCell>
                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => setDialog({ open: true, edit: mat })}>
                            <EditOutlinedIcon sx={{ fontSize: 16, color: '#637381' }} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton size="small" onClick={() => setMaterials((p) => p.filter((m) => m.id !== mat.id))}>
                            <DeleteOutlineIcon sx={{ fontSize: 16, color: '#E53935' }} />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>

                    {/* ── Level 2: SKUs ── */}
                    <TableRow key={`${mat.id}-skus`}>
                      <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
                        <Collapse in={expandedMat.has(mat.id)} timeout="auto" unmountOnExit>
                          <Box sx={{ bgcolor: '#FAFBFC', borderBottom: '1px solid #E8ECEF' }}>
                            {mat.skus.length === 0 ? (
                              <Box sx={{ pl: 6, py: 1.5 }}>
                                <span style={{ fontSize: '0.75rem', color: '#9EA8B3' }}>No SKUs — click Edit to add</span>
                              </Box>
                            ) : (
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ '& th': { bgcolor: '#F0F3F5', py: '5px', fontSize: '0.72rem', color: '#637381', fontWeight: 600 } }}>
                                    <TableCell width={36} />
                                    <TableCell sx={{ pl: 6 }}>SKU Type</TableCell>
                                    <TableCell>SKU Code</TableCell>
                                    <TableCell>Container Type</TableCell>
                                    <TableCell>Container Sub-type</TableCell>
                                    <TableCell>Sub SKUs</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {mat.skus.map((sku) => (
                                    <>
                                      {/* ── SKU row ── */}
                                      <TableRow key={sku.id} sx={{ bgcolor: '#FAFBFC', '& td': { borderBottom: expandedSku.has(sku.id) ? 'none' : undefined } }}>
                                        <TableCell padding="checkbox" sx={{ pl: 1 }}>
                                          <IconButton size="small" onClick={() => toggle(expandedSku, setExpandedSku, sku.id)}>
                                            {expandedSku.has(sku.id)
                                              ? <KeyboardArrowDownIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                              : <KeyboardArrowRightIcon sx={{ fontSize: 16, color: '#9EA8B3' }} />}
                                          </IconButton>
                                        </TableCell>
                                        <TableCell sx={{ pl: 6, fontWeight: 500, fontSize: '0.8rem' }}>{sku.skuType}</TableCell>
                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#637381' }}>{sku.skuCode}</TableCell>
                                        <TableCell sx={{ fontSize: '0.8rem' }}>{sku.containerType}</TableCell>
                                        <TableCell sx={{ fontSize: '0.8rem', color: '#637381' }}>{sku.containerSubType}</TableCell>
                                        <TableCell sx={{ fontSize: '0.8rem', color: '#637381' }}>{sku.subSkus.length}</TableCell>
                                      </TableRow>

                                      {/* ── Level 3: Sub SKUs ── */}
                                      <TableRow key={`${sku.id}-subs`} sx={{ bgcolor: '#FAFBFC' }}>
                                        <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
                                          <Collapse in={expandedSku.has(sku.id)} timeout="auto" unmountOnExit>
                                            <Box sx={{ bgcolor: '#F5F7F9', borderBottom: '1px solid #EEF0F2' }}>
                                              {sku.subSkus.length === 0 ? (
                                                <Box sx={{ pl: 10, py: 1.5 }}>
                                                  <span style={{ fontSize: '0.72rem', color: '#9EA8B3' }}>No sub SKUs — click Edit to add</span>
                                                </Box>
                                              ) : (
                                                <Table size="small">
                                                  <TableHead>
                                                    <TableRow sx={{ '& th': { bgcolor: '#EEF0F2', py: '4px', fontSize: '0.7rem', color: '#637381', fontWeight: 600 } }}>
                                                      <TableCell sx={{ pl: 10 }}>Sub SKU Name</TableCell>
                                                      <TableCell>Sub SKU Code</TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {sku.subSkus.map((ss) => (
                                                      <TableRow key={ss.id} sx={{ bgcolor: '#F5F7F9' }}>
                                                        <TableCell sx={{ pl: 10, fontSize: '0.78rem', fontWeight: 500 }}>{ss.name}</TableCell>
                                                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#637381' }}>{ss.code}</TableCell>
                                                      </TableRow>
                                                    ))}
                                                  </TableBody>
                                                </Table>
                                              )}
                                            </Box>
                                          </Collapse>
                                        </TableCell>
                                      </TableRow>
                                    </>
                                  ))}
                                </TableBody>
                              </Table>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </>
                ))}
                {paginated.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No materials found</TableCell>
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

      <AddMaterialDialog
        open={dialog.open}
        initial={dialog.edit}
        onClose={() => setDialog({ open: false })}
        onSave={handleSave}
      />
    </Box>
  );
}
