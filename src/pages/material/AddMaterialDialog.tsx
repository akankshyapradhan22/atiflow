import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import type { MatMaterial } from '../../types';
import { PRIMARY } from '../../theme';

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<MatMaterial, 'id' | 'skus'>) => void;
  initial?: MatMaterial;
}

export default function AddMaterialDialog({ open, onClose, onSave, initial }: Props) {
  const isEdit = Boolean(initial);

  const [materialType, setMaterialType] = useState(initial?.materialType ?? '');
  const [prefix, setPrefix] = useState(initial?.prefix ?? '');
  const [preprocessingTime, setPreprocessingTime] = useState(String(initial?.preprocessingTime ?? ''));
  const [maxQty, setMaxQty] = useState(String(initial?.maxQty ?? ''));
  const [stagingAreaEnabled, setStagingAreaEnabled] = useState(initial?.stagingAreaEnabled ?? false);

  const canSave = materialType.trim() !== '' && prefix.trim() !== '';

  const handleSave = () => {
    onSave({
      materialType: materialType.trim(),
      prefix: prefix.trim(),
      preprocessingTime: Number(preprocessingTime) || 0,
      maxQty: Number(maxQty) || 0,
      stagingAreaEnabled,
    });
  };

  const inputSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '6px',
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
    },
    '& .MuiInputLabel-root.Mui-focused': { color: PRIMARY },
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '10px' } }}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332', pb: 1 }}>
        {isEdit ? 'Edit Material' : 'Add Material'}
      </DialogTitle>

      <DialogContent sx={{ pt: '8px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Material Type"
          size="small"
          fullWidth
          value={materialType}
          onChange={(e) => setMaterialType(e.target.value)}
          sx={inputSx}
        />
        <TextField
          label="Prefix"
          size="small"
          fullWidth
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          sx={inputSx}
        />
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <TextField
            label="Pre-processing Time (min)"
            size="small"
            type="number"
            fullWidth
            value={preprocessingTime}
            onChange={(e) => setPreprocessingTime(e.target.value)}
            inputProps={{ min: 0 }}
            sx={inputSx}
          />
          <TextField
            label="Max Qty"
            size="small"
            type="number"
            fullWidth
            value={maxQty}
            onChange={(e) => setMaxQty(e.target.value)}
            inputProps={{ min: 0 }}
            sx={inputSx}
          />
        </Box>
        <Box>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1a2332', mb: 0.5 }}>
            Staging Area
          </Typography>
          <RadioGroup
            row
            value={stagingAreaEnabled ? 'yes' : 'no'}
            onChange={(e) => setStagingAreaEnabled(e.target.value === 'yes')}
          >
            <FormControlLabel
              value="yes"
              control={<Radio size="small" sx={{ color: '#dde1e6', '&.Mui-checked': { color: PRIMARY } }} />}
              label={<Typography sx={{ fontSize: '0.875rem', color: '#1a2332' }}>Yes</Typography>}
            />
            <FormControlLabel
              value="no"
              control={<Radio size="small" sx={{ color: '#dde1e6', '&.Mui-checked': { color: PRIMARY } }} />}
              label={<Typography sx={{ fontSize: '0.875rem', color: '#1a2332' }}>No</Typography>}
            />
          </RadioGroup>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disableElevation
          disabled={!canSave}
          onClick={handleSave}
          sx={{ bgcolor: PRIMARY, textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#009188' } }}
        >
          {isEdit ? 'Save Changes' : 'Add Material'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
