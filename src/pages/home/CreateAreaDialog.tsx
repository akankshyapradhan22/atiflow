import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';

const POINT_TYPES = ['Consumption Point', 'Production Point'];

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (name: string, machineName: string, pointType: string) => void;
  initialValues?: { name: string; machineName: string; pointType: string };
}

export default function CreateAreaDialog({ open, onClose, onSave, initialValues }: Props) {
  const [areaName, setAreaName] = useState(initialValues?.name ?? '');
  const [machineName, setMachineName] = useState(initialValues?.machineName ?? '');
  const [pointType, setPointType] = useState(initialValues?.pointType ?? '');

  useEffect(() => {
    if (open) {
      setAreaName(initialValues?.name ?? '');
      setMachineName(initialValues?.machineName ?? '');
      setPointType(initialValues?.pointType ?? '');
    }
  }, [open, initialValues?.name, initialValues?.machineName, initialValues?.pointType]);

  const canSave = areaName.trim() !== '' && machineName.trim() !== '';

  const handleSave = () => {
    if (!canSave) return;
    onSave(areaName.trim(), machineName.trim(), pointType);
    setAreaName('');
    setMachineName('');
    setPointType('');
  };

  const handleClose = () => {
    setAreaName('');
    setMachineName('');
    setPointType('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          px: 0.5,
          py: 0.5,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem', color: '#1a2332', pb: 1 }}>
        Create New Area
      </DialogTitle>

      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '8px !important' }}>
        <TextField
          placeholder="Area Name"
          size="small"
          fullWidth
          value={areaName}
          onChange={(e) => setAreaName(e.target.value)}
          InputProps={{ sx: { borderRadius: '8px', fontSize: '0.875rem' } }}
        />

        <TextField
          placeholder="Machine Name"
          size="small"
          fullWidth
          value={machineName}
          onChange={(e) => setMachineName(e.target.value)}
          InputProps={{ sx: { borderRadius: '8px', fontSize: '0.875rem' } }}
        />

        <FormControl size="small" fullWidth>
          <InputLabel sx={{ fontSize: '0.875rem' }}>Point Type</InputLabel>
          <Select
            value={pointType}
            label="Point Type"
            onChange={(e) => setPointType(e.target.value)}
            sx={{ borderRadius: '8px', fontSize: '0.875rem' }}
          >
            {POINT_TYPES.map((p) => (
              <MenuItem key={p} value={p} sx={{ fontSize: '0.875rem' }}>{p}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon sx={{ fontSize: 16 }} />}
            sx={{
              borderColor: '#e0e0e0',
              color: '#1a2332',
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '0.8125rem',
              borderRadius: '6px',
              px: 1.5,
              py: 0.625,
              '&:hover': { borderColor: '#bdbdbd', bgcolor: 'rgba(0,0,0,0.02)' },
            }}
          >
            Add
          </Button>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: '#637381',
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={!canSave}
          sx={{
            bgcolor: '#00a99d',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.8125rem',
            textTransform: 'capitalize',
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
