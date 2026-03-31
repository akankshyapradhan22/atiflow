import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import type {
  ExecutionSource, ExecutionSourceType,
  RequesterSource, MESSource, SupervisorSource, DispatcherSource,
} from '../../types';
import { mockWorkflows, mockStagingAreas, mockProcessingAreas } from '../../data/mock';
import { PRIMARY } from '../../theme';

interface Props {
  open: boolean;
  type: ExecutionSourceType;
  source?: ExecutionSource | null;
  onClose: () => void;
  onSave: (s: Omit<RequesterSource, 'id'> | Omit<MESSource, 'id'> | Omit<SupervisorSource, 'id'> | Omit<DispatcherSource, 'id'>) => void;
}

const inputSx = {
  borderRadius: '6px',
  fontSize: '0.875rem',
  '& .MuiOutlinedInput-root': { borderRadius: '6px' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dde1e6' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
};

const selectMenuProps = {
  PaperProps: {
    sx: {
      borderRadius: '8px',
      boxShadow: '0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12)',
      mt: 0.5,
    },
  },
};

function MultiSelect({
  label, value, onChange, options,
}: {
  label: string;
  value: string[];
  onChange: (v: string[]) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: '0.875rem', color: '#637381', '&.Mui-focused': { color: PRIMARY } }}>{label}</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e: SelectChangeEvent<string[]>) => {
          const val = e.target.value;
          onChange(typeof val === 'string' ? val.split(',') : val);
        }}
        input={<OutlinedInput label={label} sx={{ borderRadius: '6px', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dde1e6' } }} />}
        renderValue={(selected) =>
          selected.length === 0 ? '' :
          selected.map((id) => options.find((o) => o.id === id)?.name ?? id).join(', ')
        }
        displayEmpty
        MenuProps={selectMenuProps}
        sx={{ borderRadius: '6px', fontSize: '0.875rem', '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY } }}
      >
        {options.map((o) => (
          <MenuItem key={o.id} value={o.id} sx={{ fontSize: '0.9375rem', px: 2 }}>
            <Checkbox
              checked={value.includes(o.id)}
              size="small"
              sx={{ p: 0.5, mr: 0.5, color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }}
            />
            <ListItemText primary={o.name} primaryTypographyProps={{ fontSize: '1rem' }} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default function AddSourceDialog({ open, type, source, onClose, onSave }: Props) {
  const [showPwd, setShowPwd] = useState(false);

  // Requester fields
  const [rName, setRName] = useState(type === 'requester' && source?.type === 'requester' ? source.name : '');
  const [rDeviceId, setRDeviceId] = useState(type === 'requester' && source?.type === 'requester' ? source.deviceId : '');
  const [rUsername, setRUsername] = useState(type === 'requester' && source?.type === 'requester' ? source.username : '');
  const [rPassword, setRPassword] = useState('');
  const [rWorkflows, setRWorkflows] = useState<string[]>(type === 'requester' && source?.type === 'requester' ? source.boundWorkflows : []);
  const [rStagingAreas, setRStagingAreas] = useState<string[]>(type === 'requester' && source?.type === 'requester' ? source.visibleStagingAreas : []);
  const [rUiMode, setRUiMode] = useState<'legacy' | 'structured'>(type === 'requester' && source?.type === 'requester' ? source.uiMode : 'structured');
  const [rBoundProcessingArea, setRBoundProcessingArea] = useState(type === 'requester' && source?.type === 'requester' ? source.boundProcessingArea : '');

  // MES fields
  const [mName, setMName] = useState(type === 'mes' && source?.type === 'mes' ? source.name : '');
  const [mPairs, setMPairs] = useState<{ key: string; value: string }[]>(
    type === 'mes' && source?.type === 'mes' ? source.keyValuePairs : [{ key: '', value: '' }]
  );
  const [mMaterialCode, setMMaterialCode] = useState(type === 'mes' && source?.type === 'mes' ? source.materialCode : '');
  const [mWorkflow, setMWorkflow] = useState(type === 'mes' && source?.type === 'mes' ? source.boundWorkflow : '');

  // Supervisor fields
  const [sName, setSName] = useState(type === 'supervisor' && source?.type === 'supervisor' ? source.name : '');
  const [sDeviceId, setSDeviceId] = useState(type === 'supervisor' && source?.type === 'supervisor' ? source.deviceId : '');
  const [sUsername, setSUsername] = useState(type === 'supervisor' && source?.type === 'supervisor' ? source.username : '');
  const [sPassword, setSPassword] = useState('');
  const [sStagingAreas, setSStagingAreas] = useState<string[]>(type === 'supervisor' && source?.type === 'supervisor' ? source.visibleStagingAreas : []);
  const [sInventoryAreas, setSInventoryAreas] = useState<string[]>(type === 'supervisor' && source?.type === 'supervisor' ? source.inventoryAreas : []);

  // Dispatcher fields
  const [dName, setDName] = useState(type === 'dispatcher' && source?.type === 'dispatcher' ? source.name : '');
  const [dDeviceId, setDDeviceId] = useState(type === 'dispatcher' && source?.type === 'dispatcher' ? source.deviceId : '');
  const [dUsername, setDUsername] = useState(type === 'dispatcher' && source?.type === 'dispatcher' ? source.username : '');
  const [dPassword, setDPassword] = useState('');
  const [dStations, setDStations] = useState<string[]>(type === 'dispatcher' && source?.type === 'dispatcher' ? source.boundStations : []);

  const handleSave = () => {
    if (type === 'requester') {
      onSave({ type: 'requester', name: rName, deviceId: rDeviceId, boundProcessingArea: rBoundProcessingArea, username: rUsername, boundWorkflows: rWorkflows, visibleStagingAreas: rStagingAreas, uiMode: rUiMode });
    } else if (type === 'mes') {
      onSave({ type: 'mes', name: mName, keyValuePairs: mPairs.filter((p) => p.key || p.value), materialCode: mMaterialCode, boundWorkflow: mWorkflow });
    } else if (type === 'supervisor') {
      onSave({ type: 'supervisor', name: sName, deviceId: sDeviceId, username: sUsername, visibleStagingAreas: sStagingAreas, inventoryAreas: sInventoryAreas });
    } else {
      onSave({ type: 'dispatcher', name: dName, deviceId: dDeviceId, username: dUsername, boundStations: dStations });
    }
  };

  const titles: Record<ExecutionSourceType, string> = {
    requester: 'Requester Device',
    mes: 'MES Configuration',
    supervisor: 'Supervisor Device',
    dispatcher: 'Dispatcher Device',
  };

  const stagingAreaOptions = mockStagingAreas.map((s) => ({ id: s.id, name: s.name }));
  const processingAreaOptions = mockProcessingAreas.map((a) => ({ id: a.id, name: a.name }));
  const requesterWorkflowOptions = mockWorkflows.filter((w) => w.tab === 'requester').map((w) => ({ id: w.id, name: w.name }));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: '10px', maxHeight: '92vh' },
      }}
    >
      <DialogTitle sx={{
        fontWeight: 600,
        fontSize: '1.25rem',
        color: '#1a2332',
        px: 3,
        pt: 2,
        pb: 2,
        lineHeight: '32px',
      }}>
        {source ? `Edit — ${titles[type]}` : `Add New — ${titles[type]}`}
      </DialogTitle>

      <DialogContent dividers sx={{ px: 3, py: 2.5, display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* ── Requester Device ─────────────────────────────────────────── */}
        {type === 'requester' && (
          <>
            <TextField
              label="Device Name"
              size="small"
              value={rName}
              onChange={(e) => setRName(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }}
              InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }}
              sx={inputSx}
            />
            <TextField
              label="Device ID"
              size="small"
              value={rDeviceId}
              onChange={(e) => setRDeviceId(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }}
              InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }}
              sx={inputSx}
            />
            <TextField
              label="Username"
              size="small"
              value={rUsername}
              onChange={(e) => setRUsername(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }}
              InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }}
              sx={inputSx}
            />
            <TextField
              label="Password"
              size="small"
              type={showPwd ? 'text' : 'password'}
              value={rPassword}
              onChange={(e) => setRPassword(e.target.value)}
              InputProps={{
                sx: { borderRadius: '6px' },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPwd((p) => !p)}>
                      {showPwd
                        ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: '#637381' }} />
                        : <VisibilityOutlinedIcon sx={{ fontSize: 18, color: '#637381' }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }}
              sx={inputSx}
            />
            <MultiSelect
              label="Bound Workflows"
              value={rWorkflows}
              onChange={setRWorkflows}
              options={requesterWorkflowOptions}
            />
            <MultiSelect
              label="Visible Staging Areas"
              value={rStagingAreas}
              onChange={setRStagingAreas}
              options={stagingAreaOptions}
            />
            <FormControl>
              <FormLabel sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#637381', mb: 0.5 }}>UI Mode</FormLabel>
              <RadioGroup row value={rUiMode} onChange={(e) => setRUiMode(e.target.value as 'legacy' | 'structured')}>
                <FormControlLabel
                  value="legacy"
                  control={<Radio size="small" sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#1a2332' }}>Legacy</Typography>}
                />
                <FormControlLabel
                  value="structured"
                  control={<Radio size="small" sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }} />}
                  label={<Typography sx={{ fontSize: '0.8125rem', color: '#1a2332' }}>Structured</Typography>}
                />
              </RadioGroup>
            </FormControl>
          </>
        )}

        {/* ── MES ─────────────────────────────────────────────────────── */}
        {type === 'mes' && (
          <>
            <TextField
              label="Workflow event mapping name"
              size="small"
              value={mName}
              onChange={(e) => setMName(e.target.value)}
              helperText="e.g. PRODUCTION_COMPLETE, BATCH_START"
              InputProps={{ sx: { borderRadius: '6px' } }}
              InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }}
              sx={inputSx}
            />

            {/* Key-Value Pairs */}
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a2332', mb: 0.25 }}>Key-Value Pairs</Typography>
              <Typography sx={{ fontSize: '0.75rem', color: '#637381', mb: 1.5 }}>Add configuration parameters as key-value pairs</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {mPairs.map((pair, idx) => (
                  <Box key={idx} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Box sx={{ border: '1px solid #dde1e6', borderRadius: '6px', flex: '0 0 249px', height: 38, display: 'flex', alignItems: 'center', px: 1.75 }}>
                      <InputBase
                        placeholder="Key"
                        value={pair.key}
                        onChange={(e) => setMPairs((p) => p.map((x, i) => i === idx ? { ...x, key: e.target.value } : x))}
                        sx={{ fontSize: '0.875rem', color: '#1a2332', width: '100%' }}
                      />
                    </Box>
                    <Box sx={{ border: '1px solid #dde1e6', borderRadius: '6px', flex: 1, height: 38, display: 'flex', alignItems: 'center', px: 1.75 }}>
                      <InputBase
                        placeholder="Value"
                        value={pair.value}
                        onChange={(e) => setMPairs((p) => p.map((x, i) => i === idx ? { ...x, value: e.target.value } : x))}
                        sx={{ fontSize: '0.875rem', color: '#1a2332', width: '100%' }}
                      />
                    </Box>
                    <Box
                      onClick={() => setMPairs((p) => p.filter((_, i) => i !== idx))}
                      sx={{
                        border: '1px solid #dde1e6', borderRadius: '6px', width: 38, height: 38,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: mPairs.length > 1 ? 'pointer' : 'default',
                        opacity: mPairs.length > 1 ? 1 : 0.3,
                        '&:hover': mPairs.length > 1 ? { bgcolor: '#f5f5f5' } : {},
                      }}
                    >
                      <Typography sx={{ fontSize: '1.1rem', color: '#637381', lineHeight: 1 }}>×</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Button
                variant="outlined"
                startIcon={<span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span>}
                onClick={() => setMPairs((p) => [...p, { key: '', value: '' }])}
                sx={{
                  mt: 1.5, borderColor: '#dde1e6', color: '#1a2332', borderRadius: '6px',
                  textTransform: 'none', fontSize: '0.875rem', fontWeight: 600, height: 38,
                  '&:hover': { borderColor: PRIMARY, color: PRIMARY, bgcolor: 'transparent' },
                }}
              >
                Add Key-Value Pair
              </Button>
            </Box>

            <TextField
              label="Material Code"
              size="small"
              value={mMaterialCode}
              onChange={(e) => setMMaterialCode(e.target.value)}
              placeholder="Enter Material Code here"
              InputProps={{ sx: { borderRadius: '6px' } }}
              InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }}
              sx={inputSx}
            />
            <TextField select label="Bound Workflow" size="small" value={mWorkflow}
              onChange={(e) => setMWorkflow(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }}
              InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }}
              sx={inputSx}>
              {mockWorkflows.map((wf) => <MenuItem key={wf.id} value={wf.id}>{wf.name}</MenuItem>)}
            </TextField>
          </>
        )}

        {/* ── Supervisor Device ────────────────────────────────────────── */}
        {type === 'supervisor' && (
          <>
            <TextField label="Device Name" size="small" value={sName} onChange={(e) => setSName(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }} InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }} sx={inputSx} />
            <TextField label="Device ID" size="small" value={sDeviceId} onChange={(e) => setSDeviceId(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }} InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }} sx={inputSx} />
            <TextField label="Username" size="small" value={sUsername} onChange={(e) => setSUsername(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }} InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }} sx={inputSx} />
            <TextField
              label="Password" size="small" type={showPwd ? 'text' : 'password'} value={sPassword}
              onChange={(e) => setSPassword(e.target.value)}
              InputProps={{
                sx: { borderRadius: '6px' },
                endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPwd((p) => !p)}>{showPwd ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: '#637381' }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18, color: '#637381' }} />}</IconButton></InputAdornment>,
              }}
              InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }}
              sx={inputSx}
            />
            <MultiSelect label="Visible Staging Areas" value={sStagingAreas} onChange={setSStagingAreas} options={stagingAreaOptions} />
            <MultiSelect label="Processing Areas" value={sInventoryAreas} onChange={setSInventoryAreas} options={processingAreaOptions} />
          </>
        )}

        {/* ── Dispatcher Device ────────────────────────────────────────── */}
        {type === 'dispatcher' && (
          <>
            <TextField label="Dispatcher Name" size="small" value={dName} onChange={(e) => setDName(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }} InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }} sx={inputSx} />
            <TextField label="Device ID" size="small" value={dDeviceId} onChange={(e) => setDDeviceId(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }} InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }} sx={inputSx} />
            <TextField label="Username" size="small" value={dUsername} onChange={(e) => setDUsername(e.target.value)}
              InputProps={{ sx: { borderRadius: '6px' } }} InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }} sx={inputSx} />
            <TextField
              label="Password" size="small" type={showPwd ? 'text' : 'password'} value={dPassword}
              onChange={(e) => setDPassword(e.target.value)}
              InputProps={{
                sx: { borderRadius: '6px' },
                endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPwd((p) => !p)}>{showPwd ? <VisibilityOffOutlinedIcon sx={{ fontSize: 18, color: '#637381' }} /> : <VisibilityOutlinedIcon sx={{ fontSize: 18, color: '#637381' }} />}</IconButton></InputAdornment>,
              }}
              InputLabelProps={{ sx: { fontSize: '0.875rem', color: '#637381' } }}
              sx={inputSx}
            />
            <Box>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#637381', mb: 1 }}>Bound Stations</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {['ST-001', 'ST-002', 'ST-003', 'ST-004'].map((st) => (
                  <FormControlLabel key={st}
                    control={<Checkbox size="small" checked={dStations.includes(st)} onChange={() => setDStations((p) => p.includes(st) ? p.filter((x) => x !== st) : [...p, st])} sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }} />}
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#1a2332' }}>{st}</Typography>}
                  />
                ))}
              </Box>
            </Box>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          onClick={onClose}
          sx={{ color: '#1a2332', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.28px', textTransform: 'none', borderRadius: '6px', px: 2, height: 44 }}
        >
          CANCEL
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disableElevation
          sx={{ bgcolor: '#009688', color: '#fff', fontWeight: 600, fontSize: '0.875rem', letterSpacing: '0.28px', textTransform: 'none', borderRadius: '6px', px: 2.5, height: 44, '&:hover': { bgcolor: '#00877a' } }}
        >
          SAVE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
