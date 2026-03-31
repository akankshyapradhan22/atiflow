import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import type { MatMaterial } from '../../types';

interface Props {
  open: boolean;
  material?: MatMaterial;
  onClose: () => void;
  onSave: (data: Omit<MatMaterial, 'id'>) => void;
}

export default function AddMaterialDialog({ open, material, onClose, onSave }: Props) {
  const [className, setClassName] = useState('');
  const [materialCode, setMaterialCode] = useState('');
  const [preprocessingTime, setPreprocessingTime] = useState(0);
  const [maxQty, setMaxQty] = useState(10);

  useEffect(() => {
    if (open) {
      setClassName(material?.className ?? '');
      setMaterialCode(material?.materialCode ?? '');
      setPreprocessingTime(material?.preprocessingTime ?? 0);
      setMaxQty(material?.maxQty ?? 10);
    }
  }, [open, material]);

  const handleSave = () => {
    onSave({
      className, materialCode, preprocessingTime, maxQty,
      skus: material?.skus ?? [],
    });
  };

  const valid = className.trim() && materialCode.trim();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { maxHeight: '90vh' } }}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem' }}>
        {material ? 'Edit Material' : 'Add Material'}
      </DialogTitle>

      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
          <TextField label="Material Class" size="small" value={className}
            onChange={(e) => setClassName(e.target.value)} required />
          <TextField label="Material Code" size="small" value={materialCode}
            onChange={(e) => setMaterialCode(e.target.value)} required />
          <TextField label="Pre-processing Time (min)" size="small" type="number"
            value={preprocessingTime} onChange={(e) => setPreprocessingTime(Number(e.target.value))} />
          <TextField label="Max Qty" size="small" type="number"
            value={maxQty} onChange={(e) => setMaxQty(Number(e.target.value))} />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">CANCEL</Button>
        <Button variant="contained" onClick={handleSave} disabled={!valid}>SAVE</Button>
      </DialogActions>
    </Dialog>
  );
}
