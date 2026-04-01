import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { PRIMARY } from '../../theme';

const POINT_TYPES = ['Consumption Point', 'Production Point'];

export interface DialogMachine {
  machineName: string;
  pointType: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, machines: DialogMachine[]) => void;
  initialValues?: { name: string; machineName: string; pointType: string };
}

const emptyMachine = (): DialogMachine => ({ machineName: '', pointType: '' });

export default function CreateAreaDialog({ open, onClose, onSave, initialValues }: Props) {
  const [areaName, setAreaName] = useState(initialValues?.name ?? '');
  const [machines, setMachines] = useState<DialogMachine[]>([
    { machineName: initialValues?.machineName ?? '', pointType: initialValues?.pointType ?? '' },
  ]);

  useEffect(() => {
    if (open) {
      setAreaName(initialValues?.name ?? '');
      setMachines([{ machineName: initialValues?.machineName ?? '', pointType: initialValues?.pointType ?? '' }]);
    }
  }, [open, initialValues?.name, initialValues?.machineName, initialValues?.pointType]);

  const canSave = areaName.trim() !== '' && machines.some((m) => m.machineName.trim() !== '');

  const handleSave = () => {
    if (!canSave) return;
    onSave(areaName.trim(), machines.filter((m) => m.machineName.trim() !== ''));
    setAreaName('');
    setMachines([emptyMachine()]);
  };

  const handleClose = () => {
    setAreaName('');
    setMachines([emptyMachine()]);
    onClose();
  };

  const updateMachine = (idx: number, field: keyof DialogMachine, value: string) =>
    setMachines((prev) => prev.map((m, i) => i === idx ? { ...m, [field]: value } : m));

  const addMachine = () => setMachines((prev) => [...prev, emptyMachine()]);

  const removeMachine = (idx: number) =>
    setMachines((prev) => prev.filter((_, i) => i !== idx));

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      fontSize: '0.875rem',
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY },
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: '12px' } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#1a2332', pb: 1.5 }}>
        Create New Area
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, pt: '4px !important' }}>

        {/* Area Name — always flat, standalone */}
        <TextField
          label="Area Name"
          size="small"
          fullWidth
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          sx={fieldSx}
        />

        {/* Machine rows */}
        {machines.map((machine, idx) => (
          <Box key={idx}>
            {/* Divider + remove button only for rows added via Add */}
            {idx > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <Divider sx={{ flex: 1, borderColor: '#e8ecef' }} />
                <IconButton
                  size="small"
                  onClick={() => removeMachine(idx)}
                  sx={{ color: '#9ea8b3', p: 0.25, '&:hover': { color: '#d32f2f' } }}
                >
                  <CloseIcon sx={{ fontSize: 15 }} />
                </IconButton>
              </Box>
            )}

            {/* Machine Name */}
            <TextField
              label="Machine Name"
              size="small"
              fullWidth
              value={machine.machineName}
              onChange={(e) => updateMachine(idx, 'machineName', e.target.value)}
              sx={{ ...fieldSx, mb: 1.5 }}
            />

            {/* Point Type */}
            <TextField
              select
              label="Point Type"
              size="small"
              fullWidth
              value={machine.pointType}
              onChange={(e) => updateMachine(idx, 'pointType', e.target.value)}
              sx={fieldSx}
            >
              <MenuItem value="" sx={{ fontSize: '0.875rem', color: '#9ea8b3' }}>— Select —</MenuItem>
              {POINT_TYPES.map((p) => (
                <MenuItem key={p} value={p} sx={{ fontSize: '0.875rem' }}>{p}</MenuItem>
              ))}
            </TextField>
          </Box>
        ))}

        {/* Add button */}
        <Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            onClick={addMachine}
            sx={{
              borderColor: '#d0d5dd',
              color: '#1a2332',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.875rem',
              borderRadius: '6px',
              px: 1.75,
              py: 0.75,
              '&:hover': { borderColor: '#9ea8b3', bgcolor: 'rgba(0,0,0,0.02)' },
            }}
          >
            Add
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1, borderTop: '1px solid #f0f0f0' }}>
        <Button
          onClick={handleClose}
          sx={{ color: '#637381', fontWeight: 600, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!canSave}
          sx={{
            bgcolor: PRIMARY,
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            textTransform: 'none',
            borderRadius: '6px',
            boxShadow: 'none',
            px: 2.5,
            '&:hover': { bgcolor: '#009688', boxShadow: 'none' },
            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' },
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
