import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import type { Container } from '../../types';

const CONTAINER_TYPES = ['Trolley', 'Pallet', 'Bin'];
const SUBTYPES: Record<string, string[]> = {
  Trolley: ['Trolley Type 1', 'Trolley Type 2', 'Trolley Type 3'],
  Pallet: ['Pallet Type 1', 'Pallet Type 2'],
  Bin: ['Bin Type 1', 'Bin Type 2'],
};

interface Props {
  open: boolean;
  container?: Container | null;
  onClose: () => void;
  onSave: (c: Omit<Container, 'id'>) => void;
}

export default function AddContainerDialog({ open, container, onClose, onSave }: Props) {
  const [type, setType] = useState(container?.type ?? '');
  const [subType, setSubType] = useState(container?.subType ?? '');
  const [dimL, setDimL] = useState('100');
  const [dimW, setDimW] = useState('100');
  const [dimH, setDimH] = useState('100');
  const [containerId, setContainerId] = useState(container?.containerId ?? '');
  const [hitchLength, setHitchLength] = useState(String(container?.hitchLength ?? '100'));
  const [qty, setQty] = useState(String(container?.qty ?? '20'));

  useEffect(() => {
    if (open) {
      setType(container?.type ?? '');
      setSubType(container?.subType ?? '');
      setContainerId(container?.containerId ?? '');
      setHitchLength(String(container?.hitchLength ?? '100'));
      setQty(String(container?.qty ?? '20'));
    }
  }, [open, container]);

  const handleSave = () => {
    onSave({
      serialNo: container?.serialNo ?? 0,
      containerId: containerId.trim() || `CNT-${Math.random().toString(36).slice(2, 7).toUpperCase()}`,
      type, subType,
      dimensions: `${type}: ${dimL}(L)*${dimW}(W)*${dimH}(H)`,
      hitchLength: Number(hitchLength),
      qty: Number(qty),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{container ? 'Edit Container' : 'Add New Container'}</DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField select label="Container Type" size="small" value={type} required
          onChange={(e) => { setType(e.target.value); setSubType(''); }}>
          {CONTAINER_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField select label="Container Sub-type" size="small" value={subType} disabled={!type}
          onChange={(e) => setSubType(e.target.value)}>
          {(SUBTYPES[type] ?? []).map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField label="Container ID" size="small" value={containerId}
          placeholder="e.g. CNT-01-A3F9B"
          onChange={(e) => setContainerId(e.target.value)} />
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>
          <TextField label="Length (cm)" size="small" type="number" value={dimL} onChange={(e) => setDimL(e.target.value)} />
          <TextField label="Width (cm)" size="small" type="number" value={dimW} onChange={(e) => setDimW(e.target.value)} />
          <TextField label="Height (cm)" size="small" type="number" value={dimH} onChange={(e) => setDimH(e.target.value)} />
        </Box>
        <TextField label="Hitch Length (cm)" size="small" type="number" value={hitchLength}
          onChange={(e) => setHitchLength(e.target.value)} />
        <TextField label="Qty" size="small" type="number" value={qty}
          onChange={(e) => setQty(e.target.value)} />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">CANCEL</Button>
        <Button variant="contained" onClick={handleSave} disabled={!type || !subType}>SAVE</Button>
      </DialogActions>
    </Dialog>
  );
}
