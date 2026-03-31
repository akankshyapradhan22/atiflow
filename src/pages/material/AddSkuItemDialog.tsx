import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import type { MaterialSkuEntry } from '../../types';

const SKU_TYPES = ['SMD', 'PBA', 'Mechanical', 'Electrical', 'DIP', 'THT'];

interface Props {
  open: boolean;
  sku?: MaterialSkuEntry;
  onClose: () => void;
  onSave: (data: Omit<MaterialSkuEntry, 'id' | 'subSkus'>) => void;
}

export default function AddSkuItemDialog({ open, sku, onClose, onSave }: Props) {
  const [skuType, setSkuType] = useState('');
  const [skuCode, setSkuCode] = useState('');

  useEffect(() => {
    if (open) {
      setSkuType(sku?.skuType ?? '');
      setSkuCode(sku?.skuCode ?? '');
    }
  }, [open, sku]);

  const valid = skuType && skuCode.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{sku ? 'Edit SKU' : 'Add SKU'}</DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <TextField select label="SKU Type" size="small" value={skuType} onChange={(e) => setSkuType(e.target.value)} required>
          {SKU_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
        </TextField>
        <TextField label="SKU Code" size="small" value={skuCode} onChange={(e) => setSkuCode(e.target.value)} required />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">CANCEL</Button>
        <Button variant="contained" disabled={!valid} onClick={() => onSave({ skuType, skuCode })}>SAVE</Button>
      </DialogActions>
    </Dialog>
  );
}
