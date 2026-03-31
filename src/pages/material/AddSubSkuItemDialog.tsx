import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import type { MaterialSubSku } from '../../types';

interface Props {
  open: boolean;
  subSku?: MaterialSubSku;
  onClose: () => void;
  onSave: (data: Omit<MaterialSubSku, 'id'>) => void;
}

export default function AddSubSkuItemDialog({ open, subSku, onClose, onSave }: Props) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (open) {
      setName(subSku?.name ?? '');
      setCode(subSku?.code ?? '');
    }
  }, [open, subSku]);

  const valid = name.trim() && code.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>{subSku ? 'Edit Sub SKU' : 'Add Sub SKU'}</DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
        <TextField label="Sub SKU Name" size="small" value={name} onChange={(e) => setName(e.target.value)} required />
        <TextField label="Sub SKU Code" size="small" value={code} onChange={(e) => setCode(e.target.value)} required />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">CANCEL</Button>
        <Button variant="contained" disabled={!valid} onClick={() => onSave({ name, code })}>SAVE</Button>
      </DialogActions>
    </Dialog>
  );
}
