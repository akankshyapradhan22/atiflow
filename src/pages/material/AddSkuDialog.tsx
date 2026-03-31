import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import type { Sku, SubSku } from '../../types';

const CONTAINER_TYPES = ['Trolley', 'Pallet', 'Bin'];
const CONTAINER_SUBTYPES: Record<string, string[]> = {
  Trolley: ['Trolley Type 1', 'Trolley Type 2', 'Trolley Type 3'],
  Pallet: ['Pallet Type 1', 'Pallet Type 2'],
  Bin: ['Bin Type 1', 'Bin Type 2'],
};
const SKU_TYPES = ['SMD', 'PBA', 'Mechanical', 'Electrical'];
const SUB_SKU_TYPES = ['Type A', 'Type B', 'Type C'];

interface Props {
  open: boolean;
  sku?: Sku | null;
  onClose: () => void;
  onSave: (sku: Omit<Sku, 'id'>) => void;
}

function emptySubSku(): Omit<SubSku, 'id'> {
  return { code: '', skuType: '', subSkuType: '', preprocessingTime: 0, active: true, maxQuantity: 10 };
}

export default function AddSkuDialog({ open, sku, onClose, onSave }: Props) {
  const [name, setName] = useState(sku?.name ?? '');
  const [aliasInput, setAliasInput] = useState('');
  const [aliases, setAliases] = useState<string[]>(sku?.aliases ?? []);
  const [containerType, setContainerType] = useState(sku?.containerType ?? '');
  const [containerSubType, setContainerSubType] = useState(sku?.containerSubType ?? '');
  const [subSkus, setSubSkus] = useState<Omit<SubSku, 'id'>[]>(
    sku?.subSkus.map(({ id: _id, ...rest }) => rest) ?? [emptySubSku()]
  );

  const addAlias = () => {
    if (aliasInput.trim() && !aliases.includes(aliasInput.trim())) {
      setAliases((p) => [...p, aliasInput.trim()]);
      setAliasInput('');
    }
  };

  const addSubSku = () => setSubSkus((p) => [...p, emptySubSku()]);
  const removeSubSku = (i: number) => setSubSkus((p) => p.filter((_, idx) => idx !== i));
  const updateSubSku = <K extends keyof Omit<SubSku, 'id'>>(i: number, key: K, val: Omit<SubSku, 'id'>[K]) => {
    setSubSkus((p) => p.map((s, idx) => (idx === i ? { ...s, [key]: val } : s)));
  };

  const handleSave = () => {
    onSave({ name, aliases, containerType, containerSubType, subSkus: subSkus.map((s, i) => ({ ...s, id: `new-${i}` })) });
  };

  const valid = name.trim() && containerType;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { maxHeight: '90vh' } }}>
      <DialogTitle sx={{ fontWeight: 600 }}>{sku ? 'Edit SKU' : 'Add New SKU'}</DialogTitle>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* SKU Name */}
        <TextField
          label="SKU Name" fullWidth size="small" value={name}
          onChange={(e) => setName(e.target.value)} required
        />

        {/* Alias Names */}
        <Box>
          <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
            <TextField
              label="Add Alias Name" size="small" value={aliasInput}
              onChange={(e) => setAliasInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addAlias()}
              sx={{ flexGrow: 1 }}
            />
            <Button variant="outlined" onClick={addAlias} sx={{ whiteSpace: 'nowrap' }}>
              Add
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
            {aliases.map((a) => (
              <Chip key={a} label={a} size="small" onDelete={() => setAliases((p) => p.filter((x) => x !== a))} />
            ))}
          </Box>
        </Box>

        {/* Container */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          <TextField select label="Container Type" size="small" value={containerType}
            onChange={(e) => { setContainerType(e.target.value); setContainerSubType(''); }}>
            {CONTAINER_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField select label="Container Sub-type" size="small" value={containerSubType}
            onChange={(e) => setContainerSubType(e.target.value)} disabled={!containerType}>
            {(CONTAINER_SUBTYPES[containerType] ?? []).map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
        </Box>

        {/* Sub-SKUs */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
            <Typography variant="subtitle2">Sub-SKUs</Typography>
            <Button startIcon={<AddIcon />} size="small" onClick={addSubSku}>
              Add Sub-SKU
            </Button>
          </Box>
          {subSkus.map((sub, i) => (
            <Box key={i} sx={{ border: '1px solid #E8ECEF', borderRadius: 1.5, p: 2, mb: 1.5, position: 'relative' }}>
              <IconButton size="small" sx={{ position: 'absolute', top: 6, right: 6 }} onClick={() => removeSubSku(i)}>
                <DeleteOutlineIcon sx={{ fontSize: 16, color: '#E53935' }} />
              </IconButton>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 1.5 }}>
                <TextField label="Sub-SKU Code" size="small" value={sub.code}
                  onChange={(e) => updateSubSku(i, 'code', e.target.value)} />
                <TextField select label="SKU Type" size="small" value={sub.skuType}
                  onChange={(e) => updateSubSku(i, 'skuType', e.target.value)}>
                  {SKU_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
                <TextField select label="Sub-SKU Type" size="small" value={sub.subSkuType}
                  onChange={(e) => updateSubSku(i, 'subSkuType', e.target.value)}>
                  {SUB_SKU_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
                </TextField>
                <TextField label="Pre-processing Time (min)" size="small" type="number"
                  value={sub.preprocessingTime}
                  onChange={(e) => updateSubSku(i, 'preprocessingTime', Number(e.target.value))} />
                <TextField label="Max Quantity" size="small" type="number"
                  value={sub.maxQuantity}
                  onChange={(e) => updateSubSku(i, 'maxQuantity', Number(e.target.value))} />
              </Box>
              <FormControlLabel
                control={<Switch checked={sub.active} size="small"
                  onChange={(e) => updateSubSku(i, 'active', e.target.checked)} />}
                label={<Typography variant="caption">Active</Typography>}
              />
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">CANCEL</Button>
        <Button variant="contained" onClick={handleSave} disabled={!valid}>SAVE</Button>
      </DialogActions>
    </Dialog>
  );
}
