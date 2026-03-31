import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import type { MaterialClass } from '../../types';

const SKU_TYPES = ['SMD', 'PBA', 'Mechanical', 'Electrical', 'DIP', 'THT'];

interface Props {
  open: boolean;
  materialClass?: MaterialClass;
  onClose: () => void;
  onSave: (data: Omit<MaterialClass, 'id' | 'skus'>) => void;
}

export default function AddMaterialClassDialog({ open, materialClass, onClose, onSave }: Props) {
  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [skuType, setSkuType] = useState('');
  const [qty, setQty] = useState(0);
  const [preprocessingTime, setPreprocessingTime] = useState(0);

  useEffect(() => {
    if (open) {
      setClassName(materialClass?.className ?? '');
      setClassCode(materialClass?.classCode ?? '');
      setSkuType(materialClass?.skuType ?? '');
      setQty(materialClass?.qty ?? 0);
      setPreprocessingTime(materialClass?.preprocessingTime ?? 0);
    }
  }, [open, materialClass]);

  const valid = className.trim() && classCode.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{materialClass ? 'Edit Material Class' : 'Add Material Class'}</DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField label="Class Name" size="small" value={className} onChange={(e) => setClassName(e.target.value)} required />
          <TextField label="Class Code" size="small" value={classCode} onChange={(e) => setClassCode(e.target.value)} required />
          <TextField select label="SKU Type" size="small" value={skuType} onChange={(e) => setSkuType(e.target.value)}>
            {SKU_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField label="Qty" size="small" type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          <TextField label="Pre-processing Time (min)" size="small" type="number" value={preprocessingTime}
            onChange={(e) => setPreprocessingTime(Number(e.target.value))} />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">CANCEL</Button>
        <Button variant="contained" disabled={!valid}
          onClick={() => onSave({ className, classCode, skuType, qty, preprocessingTime })}>
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
