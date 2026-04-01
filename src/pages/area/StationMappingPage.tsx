import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import { PRIMARY } from '../../theme';
import { mockMatMaterials, mockContainers, STATIONS } from '../../data/mock';

// ─── Row data ─────────────────────────────────────────────────────────────────

const materialRows = mockMatMaterials.map((m) => ({
  id: m.id,
  type: m.materialType,
  typeCode: m.prefix,
}));

const containerRows = Array.from(
  new Map(
    mockContainers.map((c) => [
      `${c.type}|${c.subType}`,
      { id: `${c.type}|${c.subType}`, type: c.type, typeCode: c.subType },
    ])
  ).values()
);

type Row = { id: string; type: string; typeCode: string };
// assignments[colIdx][rowId] = selected station ids
type Assignments = Record<number, Record<string, string[]>>;

// ─── Table with dynamic station columns ───────────────────────────────────────

function MappingTable({ rows }: { rows: Row[] }) {
  const [columnCount, setColumnCount] = useState(0);
  const [assignments, setAssignments] = useState<Assignments>({});

  const handleChange = (colIdx: number, rowId: string, value: string[]) => {
    setAssignments((prev) => ({
      ...prev,
      [colIdx]: { ...(prev[colIdx] ?? {}), [rowId]: value },
    }));
  };

  const thCellSx = {
    fontWeight: 600,
    fontSize: '0.8125rem',
    color: '#1a2332',
    bgcolor: 'rgba(0,0,0,0.05)',
    py: '14px',
    borderBottom: '1px solid #e8ecef',
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      {/* Add Column button */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon sx={{ fontSize: 16 }} />}
          onClick={() => setColumnCount((c) => c + 1)}
          disableElevation
          sx={{
            bgcolor: PRIMARY,
            color: '#fff',
            borderRadius: '6px',
            height: 36,
            px: 2,
            textTransform: 'none',
            fontSize: '0.875rem',
            fontWeight: 500,
            '&:hover': { bgcolor: '#009188' },
          }}
        >
          Add Column
        </Button>
      </Box>

      {/* Table */}
      <Box sx={{ border: '1px solid #e8ecef', borderRadius: '10px', overflow: 'hidden' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...thCellSx, pl: 3, width: 200 }}>Type</TableCell>
                <TableCell sx={{ ...thCellSx, width: 220 }}>Type Code</TableCell>
                {Array.from({ length: columnCount }, (_, i) => (
                  <TableCell key={i} sx={{ ...thCellSx, minWidth: 200 }}>
                    Station Name
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:not(:last-child) td': { borderBottom: '1px solid #f0f0f0' },
                    '&:hover': { bgcolor: '#f9fafb' },
                  }}
                >
                  <TableCell sx={{ pl: 3, fontWeight: 600, fontSize: '0.875rem', color: '#1a2332', py: '16px' }}>
                    {row.type}
                  </TableCell>
                  <TableCell sx={{ fontSize: '0.875rem', color: '#1a2332', py: '16px' }}>
                    {row.typeCode}
                  </TableCell>
                  {Array.from({ length: columnCount }, (_, colIdx) => {
                    const selected = assignments[colIdx]?.[row.id] ?? [];
                    return (
                      <TableCell key={colIdx} sx={{ py: '10px' }}>
                        <Select
                          multiple
                          displayEmpty
                          value={selected}
                          onChange={(e: SelectChangeEvent<string[]>) => {
                            const val = e.target.value;
                            handleChange(colIdx, row.id, typeof val === 'string' ? val.split(',') : val);
                          }}
                          renderValue={(sel) =>
                            sel.length === 0
                              ? 'Select Stations'
                              : sel.map((id) => STATIONS.find((s) => s.id === id)?.name ?? id).join(', ')
                          }
                          sx={{
                            width: '100%',
                            minWidth: 160,
                            height: 36,
                            fontSize: '0.875rem',
                            borderRadius: '8px',
                            color: selected.length === 0 ? '#9ea8b3' : '#1a2332',
                            '.MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                borderRadius: '10px',
                                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                                minWidth: 200,
                              },
                            },
                          }}
                        >
                          {STATIONS.map((s) => (
                            <MenuItem key={s.id} value={s.id} sx={{ fontSize: '0.875rem', px: 1.5, py: 0.5 }}>
                              <Checkbox
                                checked={selected.includes(s.id)}
                                size="small"
                                sx={{ p: 0.5, color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }}
                              />
                              <ListItemText
                                primary={s.name}
                                primaryTypographyProps={{ fontSize: '0.875rem' }}
                              />
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function StationMappingPage({ embedded }: { embedded?: boolean }) {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, bgcolor: 'background.default' }}>
      {/* Sub-tabs */}
      <Box sx={{ borderBottom: '1px solid #e8ecef', bgcolor: '#fff', flexShrink: 0 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          sx={{
            px: 3,
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
          <Tab label="Material Mapping" disableRipple />
          <Tab label="Container Mapping" disableRipple />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2.5, display: 'flex', flexDirection: 'column' }}>
        {tab === 0 && <MappingTable rows={materialRows} />}
        {tab === 1 && <MappingTable rows={containerRows} />}
      </Box>
    </Box>
  );
}
