import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import Tooltip from '@mui/material/Tooltip';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';

import AddIcon from '@mui/icons-material/Add';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import FmdGoodOutlinedIcon from '@mui/icons-material/FmdGoodOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import FleetOutlinedIcon from '@mui/icons-material/DirectionsBusOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import QrCodeScannerOutlinedIcon from '@mui/icons-material/QrCodeScannerOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

import type {
  Workflow, WorkflowTab, OrderType, AssignmentStrategy,
  ExecutionTrigger, StationSelectionMode, ConfirmationMode,
  StationType, ActionTypePick, ActionTypeDrop, OrderCategory, TrolleyScope,
} from '../../types';
import { mockFleets, mockMaterialMappings, mockSkus, mockContainers, STATIONS } from '../../data/mock';
import { PRIMARY } from '../../theme';

const mockAliases = Array.from(new Set(mockSkus.flatMap((s) => s.aliases)));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function InfoTip({ text }: { text: string }) {
  return (
    <Tooltip title={text} placement="top" arrow>
      <IconButton size="small" sx={{ p: 0, ml: 0.5, color: '#9EA8B3', verticalAlign: 'middle' }}>
        <InfoOutlinedIcon sx={{ fontSize: 15 }} />
      </IconButton>
    </Tooltip>
  );
}

function FieldLabel({ label, tip }: { label: string; tip?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
      <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#637381', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </Typography>
      {tip && <InfoTip text={tip} />}
    </Box>
  );
}

function RadioCard({
  value, selected, onChange, icon, title, description, badge,
}: {
  value: string; selected: boolean; onChange: () => void;
  icon: React.ReactNode; title: string; description: string; badge?: string;
}) {
  return (
    <Paper
      variant="outlined"
      onClick={onChange}
      sx={{
        p: 2, borderRadius: 2, cursor: 'pointer', flex: 1,
        borderColor: selected ? PRIMARY : '#e0e0e0',
        borderWidth: selected ? 2 : 1,
        bgcolor: selected ? `${PRIMARY}08` : '#fff',
        transition: 'all 0.15s',
        '&:hover': { borderColor: PRIMARY, bgcolor: `${PRIMARY}06` },
        position: 'relative',
      }}
    >
      {badge && (
        <Chip label={badge} size="small"
          sx={{ position: 'absolute', top: 8, right: 8, fontSize: '0.65rem', fontWeight: 700,
            bgcolor: badge === 'Required' ? `${PRIMARY}18` : '#f5f7f9',
            color: badge === 'Required' ? PRIMARY : '#637381' }} />
      )}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
        <Box sx={{ color: selected ? PRIMARY : '#9EA8B3', mt: 0.25 }}>{icon}</Box>
        <Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1a2332', lineHeight: 1.3 }}>
            {title}
          </Typography>
          <Typography sx={{ fontSize: '0.8rem', color: '#637381', mt: 0.375, lineHeight: 1.5 }}>
            {description}
          </Typography>
        </Box>
        <Radio checked={selected} size="small" sx={{ ml: 'auto', p: 0, color: selected ? PRIMARY : '#9EA8B3' }} />
      </Box>
    </Paper>
  );
}

// ─── Pickup / Drop config sub-form ────────────────────────────────────────────

interface StationConfig {
  mode: StationSelectionMode;
  mappingId: string;
  stationName: string;
  confirmModePoint: ConfirmationMode;
  confirmModeStaging: ConfirmationMode;
  actionType: string;
  isPickup: boolean;
  // keep for data compat
  stationType: StationType;
  confirmMode: ConfirmationMode;
}

function ModeToggle({ value, onChange }: { value: ConfirmationMode; onChange: (v: ConfirmationMode) => void }) {
  return (
    <Box sx={{ display: 'flex', border: '1px solid #e0e0e0', borderRadius: '6px', overflow: 'hidden' }}>
      {(['auto', 'manual'] as ConfirmationMode[]).map((v) => (
        <Box
          key={v}
          onClick={() => onChange(v)}
          sx={{
            px: 1.5, py: 0.5, fontSize: '0.8rem', fontWeight: 500, cursor: 'pointer',
            bgcolor: value === v ? PRIMARY : '#fff',
            color: value === v ? '#fff' : '#637381',
            textTransform: 'capitalize',
            transition: 'all 0.15s',
            '&:hover': value !== v ? { bgcolor: '#f5f7f9' } : {},
          }}
        >
          {v.charAt(0).toUpperCase() + v.slice(1)}
        </Box>
      ))}
    </Box>
  );
}

function StationConfigSection({
  cfg, onChange, label, actionOptions, icon,
}: {
  cfg: StationConfig;
  onChange: (c: Partial<StationConfig>) => void;
  label: string;
  actionOptions: { value: string; label: string }[];
  icon: React.ReactNode;
}) {
  return (
    <Accordion defaultExpanded disableGutters elevation={0}
      sx={{ border: '1px solid #e8ecef', borderRadius: '8px !important', '&:before': { display: 'none' }, mb: 1.25 }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ fontSize: 18 }} />}
        sx={{ px: 2, py: 0.5, minHeight: 44, '& .MuiAccordionSummary-content': { my: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ color: PRIMARY }}>{icon}</Box>
          <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a2332' }}>{label}</Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 2, pb: 2, pt: 0.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>

          {/* Station Selection */}
          <Box>
            <FieldLabel label="Station Selection" tip="Static: a fixed station. Mapping-based: determined dynamically from a mapping table." />
            <RadioGroup row value={cfg.mode} onChange={(e) => onChange({ mode: e.target.value as StationSelectionMode })}>
              {[{ v: 'static', l: 'Static' }, { v: 'mapping-based', l: 'Mapping-based' }].map((o) => (
                <FormControlLabel key={o.v} value={o.v}
                  control={<Radio size="small" sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }} />}
                  label={<Typography sx={{ fontSize: '0.875rem' }}>{o.l}</Typography>} />
              ))}
            </RadioGroup>
            {cfg.mode === 'static' ? (
              <TextField select size="small" value={cfg.stationName}
                onChange={(e) => onChange({ stationName: e.target.value })}
                sx={{ mt: 0.75, minWidth: 160 }}
                label="Station Name"
              >
                {STATIONS.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
              </TextField>
            ) : (
              <TextField select size="small" value={cfg.mappingId}
                onChange={(e) => onChange({ mappingId: e.target.value })}
                sx={{ mt: 0.75, minWidth: 160 }}
                label="Mapping ID"
              >
                {mockMaterialMappings.map((m) => <MenuItem key={m.id} value={m.id}>{m.id}</MenuItem>)}
              </TextField>
            )}
          </Box>

          {/* Confirmation Mode table */}
          <Box>
            <FieldLabel label="Confirmation Mode" tip="Auto: no manual confirmation needed. Manual: operator must confirm." />
            <Box sx={{ border: '1px solid #e8ecef', borderRadius: '6px', overflow: 'hidden' }}>
              <Box sx={{ display: 'flex', px: 1.5, py: 0.75, bgcolor: '#f9fafb', borderBottom: '1px solid #e8ecef' }}>
                <Typography sx={{ flex: 1, fontSize: '0.75rem', fontWeight: 600, color: '#637381', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Station Type</Typography>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#637381', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mode</Typography>
              </Box>
              {[
                { label: 'Point Station', key: 'confirmModePoint' as const },
                { label: 'Staging Area', key: 'confirmModeStaging' as const },
              ].map((row, i) => (
                <Box key={row.key} sx={{
                  display: 'flex', alignItems: 'center', px: 1.5, py: 1,
                  borderBottom: i === 0 ? '1px solid #f0f0f0' : 'none',
                }}>
                  <Typography sx={{ flex: 1, fontSize: '0.8125rem', color: '#1a2332' }}>{row.label}</Typography>
                  <ModeToggle value={cfg[row.key]} onChange={(v) => onChange({ [row.key]: v })} />
                </Box>
              ))}
            </Box>
          </Box>

          {/* Action Type */}
          <Box>
            <FieldLabel label="Action Type" tip="How the robot interacts with the container at this station." />
            <RadioGroup row value={cfg.actionType} onChange={(e) => onChange({ actionType: e.target.value })}>
              {actionOptions.map((o) => (
                <FormControlLabel key={o.value} value={o.value}
                  control={<Radio size="small" sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }} />}
                  label={<Typography sx={{ fontSize: '0.875rem' }}>{o.label}</Typography>} />
              ))}
            </RadioGroup>
          </Box>

        </Box>
      </AccordionDetails>
    </Accordion>
  );
}

// ─── Review row ───────────────────────────────────────────────────────────────

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 0.875, borderBottom: '1px solid #f0f0f0', '&:last-child': { borderBottom: 'none' } }}>
      <Typography sx={{ fontSize: '0.8125rem', color: '#637381', fontWeight: 500 }}>{label}</Typography>
      <Typography sx={{ fontSize: '0.8125rem', color: '#1a2332', fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}

// ─── STEPS ────────────────────────────────────────────────────────────────────

const ALL_STEPS = ['Order Types', 'Basics', 'Material Order', 'Container Order', 'Review'];
const MATERIAL_STEPS = ['Order Types', 'Basics', 'Material Order', 'Review'];
const CONTAINER_STEPS = ['Order Types', 'Basics', 'Container Order', 'Review'];

// ─── Main Dialog ──────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  tab: WorkflowTab;
  workflow?: Workflow | null;
  onClose: () => void;
  onSave: (w: Omit<Workflow, 'id'>) => void;
}

export default function AddWorkflowDialog({ open, tab, workflow, onClose, onSave }: Props) {
  const isEdit = Boolean(workflow);
  const [step, setStep] = useState(0);

  // ── Step 0: Order Types (multi-select)
  const [orderMaterial, setOrderMaterial] = useState(workflow?.orderCategory !== 'container');
  const [orderContainer, setOrderContainer] = useState(workflow?.orderCategory === 'container');
  const [orderCategory, setOrderCategory] = useState<OrderCategory>(workflow?.orderCategory ?? 'material');

  // ── Step 1: Basics
  const [name, setName] = useState(workflow?.name ?? '');
  const [productionUnit, setProductionUnit] = useState(workflow?.productionUnit ?? '');
  const [orderType, setOrderType] = useState<OrderType>(workflow?.orderType ?? 'single');
  const [fleet, setFleet] = useState(workflow?.fleet ?? mockFleets[0]);

  // ── Step 2: Assignment Strategy (shared)
  const [strategy, setStrategy] = useState<AssignmentStrategy>(workflow?.assignmentStrategy ?? 'request-based');
  const [trigger, setTrigger] = useState<ExecutionTrigger>(workflow?.executionTrigger ?? 'dispatch');

  // ── Step 2: Material Order scope
  const [matScope, setMatScope] = useState(workflow?.materialScope ?? 'sku');
  const [selectedSkus, setSelectedSkus] = useState<string[]>(workflow?.selectedSkus ?? []);
  const [selectedAliases, setSelectedAliases] = useState<string[]>(workflow?.selectedAliases ?? []);
  const [selectedParents, setSelectedParents] = useState<string[]>(workflow?.parentMaterials ?? []);

  // ── Step 2: Container Order scope
  const [trolleyScope, setTrolleyScope] = useState<TrolleyScope>(workflow?.trolleyScope ?? 'from-sku');
  const [selectedTrolleys, setSelectedTrolleys] = useState<string[]>(workflow?.selectedTrolleys ?? []);

  // ── Station config (shared for both order types)
  const [puCfg, setPuCfg] = useState<StationConfig>({
    mode: workflow?.pickupConfig.stationSelectionMode ?? 'static',
    mappingId: workflow?.pickupConfig.mappingId ?? mockMaterialMappings[0]?.id ?? '',
    stationName: STATIONS[0]?.id ?? '',
    confirmModePoint: 'manual',
    confirmModeStaging: 'manual',
    stationType: workflow?.pickupConfig.stationType ?? 'point',
    confirmMode: workflow?.pickupConfig.confirmationMode ?? 'auto',
    actionType: workflow?.pickupConfig.actionType ?? 'pick',
    isPickup: true,
  });
  const [dropCfg, setDropCfg] = useState<StationConfig>({
    mode: workflow?.dropConfig.stationSelectionMode ?? 'static',
    mappingId: workflow?.dropConfig.mappingId ?? mockMaterialMappings[0]?.id ?? '',
    stationName: STATIONS[0]?.id ?? '',
    confirmModePoint: 'manual',
    confirmModeStaging: 'manual',
    stationType: 'point',
    confirmMode: 'auto',
    actionType: workflow?.dropConfig.actionType ?? 'drop',
    isPickup: false,
  });

  // Reset to step 0 when opened fresh
  useEffect(() => {
    if (open) setStep(isEdit ? 1 : 0);
  }, [open, isEdit]);

  const activeSteps = (orderMaterial && orderContainer) ? ALL_STEPS
    : orderContainer ? CONTAINER_STEPS : MATERIAL_STEPS;
  const totalSteps  = activeSteps.length;
  const isLast      = step === totalSteps - 1;
  const canNext     = (step === 0 && (orderMaterial || orderContainer))
    || (step === 1 && name.trim().length > 0)
    || step >= 2;

  const handleNext = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  // Map active step index back to logical step name
  const stepName = activeSteps[step];

  const handleSave = () => {
    onSave({
      name, productionUnit, tab, orderCategory, orderType, fleet,
      assignmentStrategy: strategy,
      executionTrigger: strategy === 'on-route' ? trigger : undefined,
      // Material fields
      materialScope: orderCategory === 'material' ? matScope as 'sku' | 'alias' | 'parent' : undefined,
      selectedSkus: orderCategory === 'material' && matScope === 'sku' ? selectedSkus : undefined,
      selectedAliases: orderCategory === 'material' && matScope === 'alias' ? selectedAliases : undefined,
      parentMaterials: orderCategory === 'material' && matScope === 'parent' ? selectedParents : undefined,
      // Container fields
      trolleyScope: orderCategory === 'container' ? trolleyScope : undefined,
      selectedTrolleys: orderCategory === 'container' && trolleyScope === 'manual' ? selectedTrolleys : undefined,
      pickupConfig: {
        stationSelectionMode: puCfg.mode,
        mappingId: puCfg.mode === 'mapping-based' ? puCfg.mappingId : undefined,
        stationType: puCfg.stationType,
        confirmationMode: puCfg.confirmMode,
        actionType: puCfg.actionType as ActionTypePick,
      },
      dropConfig: {
        stationSelectionMode: dropCfg.mode,
        mappingId: dropCfg.mode === 'mapping-based' ? dropCfg.mappingId : undefined,
        actionType: dropCfg.actionType as ActionTypeDrop,
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { maxHeight: '90vh', borderRadius: 2, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }}>

      {/* ── Title ─────────────────────────────────────── */}
      <DialogTitle sx={{ pb: 0, pt: 2, px: 3, flexShrink: 0 }}>
        <Typography sx={{ fontWeight: 700, fontSize: '1.0625rem', color: '#1a2332' }}>
          {isEdit ? 'Edit Workflow' : 'Add New Workflow'}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', color: '#637381', mt: 0.25 }}>
          {isEdit ? 'Update the configuration for this workflow.' : 'Configure a new workflow in a few steps.'}
        </Typography>
      </DialogTitle>

      {/* ── Stepper ───────────────────────────────────── */}
      <Box sx={{ px: 3, pt: 1.5, flexShrink: 0 }}>
        <Stepper activeStep={step} alternativeLabel
          sx={{
            '& .MuiStepLabel-label': { fontSize: '0.7rem', fontWeight: 500, mt: 0.375 },
            '& .MuiStepLabel-label.Mui-active': { fontWeight: 700, color: PRIMARY },
            '& .MuiStepLabel-label.Mui-completed': { color: '#637381' },
            '& .MuiStepConnector-line': { borderColor: '#e8ecef' },
            '& .MuiStepIcon-root': { fontSize: '1.25rem' },
            '& .MuiStepIcon-root.Mui-active': { color: PRIMARY },
            '& .MuiStepIcon-root.Mui-completed': { color: PRIMARY },
          }}>
          {activeSteps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      <Divider sx={{ mt: 1.5, borderColor: '#f0f0f0', flexShrink: 0 }} />

      {/* ── Content ───────────────────────────────────── */}
      <DialogContent sx={{ px: 3, py: 2, overflowY: 'auto', flex: 1, minHeight: 0 }}>

        {/* ── STEP 0: Order Types ─────────────────────── */}
        {stepName === 'Order Types' && (
          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332', mb: 0.5 }}>
              Select Order Types
            </Typography>
            <Typography sx={{ fontSize: '0.8125rem', color: '#637381', mb: 2.5 }}>
              Click to add to workflow. The order you select determines execution sequence.
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Order Material card */}
              <Paper
                variant="outlined"
                onClick={() => {
                  setOrderMaterial((v) => !v);
                  if (!orderMaterial) setOrderCategory('material');
                }}
                sx={{
                  p: 2, borderRadius: 2, cursor: 'pointer',
                  borderColor: orderMaterial ? PRIMARY : '#e0e0e0',
                  borderWidth: orderMaterial ? 2 : 1,
                  bgcolor: orderMaterial ? `${PRIMARY}08` : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: PRIMARY },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1a2332' }}>Order Material</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#637381', mt: 0.25 }}>
                    Handle material ordering workflows including requisition and approval
                  </Typography>
                </Box>
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%', border: `2px solid ${orderMaterial ? PRIMARY : '#c0c0c0'}`,
                  bgcolor: orderMaterial ? PRIMARY : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ml: 2,
                }}>
                  {orderMaterial
                    ? <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                        {orderMaterial && orderContainer ? '1' : '1'}
                      </Typography>
                    : <AddIcon sx={{ fontSize: 16, color: '#9EA8B3' }} />}
                </Box>
              </Paper>

              {/* Order Container card */}
              <Paper
                variant="outlined"
                onClick={() => {
                  setOrderContainer((v) => !v);
                  if (!orderContainer) setOrderCategory('container');
                }}
                sx={{
                  p: 2, borderRadius: 2, cursor: 'pointer',
                  borderColor: orderContainer ? PRIMARY : '#e0e0e0',
                  borderWidth: orderContainer ? 2 : 1,
                  bgcolor: orderContainer ? `${PRIMARY}08` : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.15s',
                  '&:hover': { borderColor: PRIMARY },
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1a2332' }}>Order Container</Typography>
                  <Typography sx={{ fontSize: '0.8rem', color: '#637381', mt: 0.25 }}>
                    Handle container ordering workflows including shipping and logistics
                  </Typography>
                </Box>
                <Box sx={{
                  width: 28, height: 28, borderRadius: '50%', border: `2px solid ${orderContainer ? PRIMARY : '#c0c0c0'}`,
                  bgcolor: orderContainer ? PRIMARY : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, ml: 2,
                }}>
                  {orderContainer
                    ? <Typography sx={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
                        {orderMaterial && orderContainer ? '2' : '1'}
                      </Typography>
                    : <AddIcon sx={{ fontSize: 16, color: '#9EA8B3' }} />}
                </Box>
              </Paper>

              {/* Workflow sequence summary */}
              {(orderMaterial || orderContainer) && (
                <Box sx={{ mt: 1, p: 1.5, bgcolor: '#f5f7f9', borderRadius: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1a2332', mb: 0.25 }}>Workflow Sequence</Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#637381' }}>
                      {[orderMaterial && '1. Order Material', orderContainer && `${orderMaterial ? '2' : '1'}. Order Container`].filter(Boolean).join(' → ')}
                    </Typography>
                  </Box>
                  <Button size="small" onClick={() => { setOrderMaterial(false); setOrderContainer(false); }}
                    sx={{ fontSize: '0.75rem', color: PRIMARY, textTransform: 'none', textDecoration: 'underline', p: 0, minWidth: 0 }}>
                    Clear All
                  </Button>
                </Box>
              )}
            </Box>

            {!orderMaterial && !orderContainer && (
              <Typography sx={{ mt: 2, fontSize: '0.8rem', color: '#9EA8B3' }}>
                Select at least one order type to continue
              </Typography>
            )}
          </Box>
        )}

        {/* ── STEP 1: Basics ──────────────────────────── */}
        {stepName === 'Basics' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box>
              <FieldLabel label="Workflow Name" />
              <TextField
                fullWidth size="small" placeholder="e.g. SMD Line 1 Material Request"
                value={name} onChange={(e) => setName(e.target.value)}
                inputProps={{ maxLength: 80 }}
              />
            </Box>
            <Box>
              <FieldLabel label="Production Unit" />
              <TextField select size="small" fullWidth value={productionUnit}
                onChange={(e) => setProductionUnit(e.target.value)}
                SelectProps={{ displayEmpty: true }}
                InputLabelProps={{ shrink: false }}
              >
                <MenuItem value=""><em style={{ color: '#9EA8B3', fontStyle: 'normal' }}>Select production unit</em></MenuItem>
                {['ROTR', 'TBM', 'SMD 1', 'SMD 2', 'PBA 1', 'PBA 2'].map((u) => (
                  <MenuItem key={u} value={u}>{u}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        )}

        {/* ── STEP 2: Material Order ──────────────────── */}
        {stepName === 'Material Order' && (
          <Box>
            {/* Assignment Strategy — read-only, always Request Based */}
            <Box sx={{ mb: 2 }}>
              <FieldLabel label="Assignment Strategy" />
              <Box sx={{
                px: 1.5, py: 1, border: '1px solid #e8ecef', borderRadius: '8px',
                bgcolor: '#f9fafb', fontSize: '0.875rem', color: '#1a2332',
              }}>
                Request Based (Default)
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#f0f0f0', mb: 2 }} />

            {/* Material Scope */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CategoryOutlinedIcon sx={{ fontSize: 18, color: PRIMARY }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1a2332' }}>
                  Material Scope
                </Typography>
                <InfoTip text="Determines how materials are identified on the requester tablet." />
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {[
                  { v: 'sku', l: 'SKU Name', desc: 'Show the primary SKU identifier' },
                  { v: 'alias', l: 'Alias Name', desc: 'Show user-friendly alias labels' },
                  { v: 'parent', l: 'Parent Material', desc: 'Filter by parent material group' },
                ].map((o) => (
                  <Paper
                    key={o.v} variant="outlined" onClick={() => setMatScope(o.v as 'sku' | 'alias' | 'parent')}
                    sx={{
                      px: 2, py: 1.25, borderRadius: 1.5, cursor: 'pointer', flex: 1, minWidth: 130,
                      borderColor: matScope === o.v ? PRIMARY : '#e0e0e0',
                      borderWidth: matScope === o.v ? 2 : 1,
                      bgcolor: matScope === o.v ? `${PRIMARY}08` : '#fff',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.375 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: matScope === o.v ? PRIMARY : '#1a2332' }}>
                        {o.l}
                      </Typography>
                      {matScope === o.v && <CheckCircleIcon sx={{ fontSize: 16, color: PRIMARY }} />}
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#637381', lineHeight: 1.4 }}>{o.desc}</Typography>
                  </Paper>
                ))}
              </Box>
              {matScope === 'sku' && (
                <TextField
                  select label="List of SKU" size="small" fullWidth sx={{ mt: 1.5 }}
                  SelectProps={{ multiple: true, renderValue: (v) => (v as string[]).map((id) => mockSkus.find((s) => s.id === id)?.name ?? id).join(', ') }}
                  value={selectedSkus}
                  onChange={(e) => setSelectedSkus(e.target.value as unknown as string[])}
                >
                  {mockSkus.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </TextField>
              )}
              {matScope === 'alias' && (
                <TextField
                  select label="Alias labels" size="small" fullWidth sx={{ mt: 1.5 }}
                  SelectProps={{ multiple: true, renderValue: (v) => (v as string[]).join(', ') }}
                  value={selectedAliases}
                  onChange={(e) => setSelectedAliases(e.target.value as unknown as string[])}
                >
                  {mockAliases.map((a) => <MenuItem key={a} value={a}>{a}</MenuItem>)}
                </TextField>
              )}
              {matScope === 'parent' && (
                <TextField
                  select label="Select Parent Materials" size="small" fullWidth sx={{ mt: 1.5 }}
                  SelectProps={{ multiple: true, renderValue: (v) => (v as string[]).map((id) => mockSkus.find((s) => s.id === id)?.name ?? id).join(', ') }}
                  value={selectedParents}
                  onChange={(e) => setSelectedParents(e.target.value as unknown as string[])}
                >
                  {mockSkus.map((s) => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                </TextField>
              )}
            </Box>

            <Divider sx={{ borderColor: '#f0f0f0', mb: 1.75 }} />

            {/* Pickup & Drop */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
              <TuneOutlinedIcon sx={{ fontSize: 18, color: PRIMARY }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1a2332' }}>
                Station Configuration
              </Typography>
            </Box>

            <StationConfigSection
              cfg={puCfg}
              onChange={(c) => setPuCfg((p) => ({ ...p, ...c }))}
              label="Pickup"
              icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />}
              actionOptions={[{ value: 'pick', label: 'Pick' }, { value: 'auto-hitch', label: 'Auto-hitch' }]}
            />
            <StationConfigSection
              cfg={dropCfg}
              onChange={(c) => setDropCfg((p) => ({ ...p, ...c }))}
              label="Drop"
              icon={<FmdGoodOutlinedIcon sx={{ fontSize: 18 }} />}
              actionOptions={[{ value: 'drop', label: 'Drop' }, { value: 'auto-unhitch', label: 'Auto-unhitch' }]}
            />
          </Box>
        )}

        {/* ── STEP 2: Container Order ──────────────────── */}
        {stepName === 'Container Order' && (
          <Box>
            {/* Assignment Strategy — read-only */}
            <Box sx={{ mb: 2 }}>
              <FieldLabel label="Assignment Strategy" />
              <Box sx={{
                px: 1.5, py: 1, border: '1px solid #e8ecef', borderRadius: '8px',
                bgcolor: '#f9fafb', fontSize: '0.875rem', color: '#1a2332',
              }}>
                Request Based (Default)
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#f0f0f0', mb: 2 }} />

            {/* Trolley Scope */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CategoryOutlinedIcon sx={{ fontSize: 18, color: PRIMARY }} />
                <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1a2332' }}>
                  Trolley Scope
                </Typography>
                <InfoTip text="Determines how trolleys are identified on the requester screen." />
              </Box>
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                {[
                  { v: 'from-sku', l: 'From SKU', desc: 'Trolley type is derived from the linked SKU configuration' },
                  { v: 'manual', l: 'Manual', desc: 'Requester selects from a list of trolley types' },
                ].map((o) => (
                  <Paper
                    key={o.v} variant="outlined" onClick={() => setTrolleyScope(o.v as TrolleyScope)}
                    sx={{
                      px: 2, py: 1.25, borderRadius: 1.5, cursor: 'pointer', flex: 1,
                      borderColor: trolleyScope === o.v ? PRIMARY : '#e0e0e0',
                      borderWidth: trolleyScope === o.v ? 2 : 1,
                      bgcolor: trolleyScope === o.v ? `${PRIMARY}08` : '#fff',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.375 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: trolleyScope === o.v ? PRIMARY : '#1a2332' }}>
                        {o.l}
                      </Typography>
                      {trolleyScope === o.v && <CheckCircleIcon sx={{ fontSize: 16, color: PRIMARY }} />}
                    </Box>
                    <Typography sx={{ fontSize: '0.75rem', color: '#637381', lineHeight: 1.4 }}>{o.desc}</Typography>
                  </Paper>
                ))}
              </Box>
              {trolleyScope === 'manual' && (
                <TextField
                  select label="Select Trolley Types" size="small" fullWidth sx={{ mt: 1.5 }}
                  SelectProps={{ multiple: true, renderValue: (v) => (v as string[]).join(', ') }}
                  value={selectedTrolleys}
                  onChange={(e) => setSelectedTrolleys(e.target.value as unknown as string[])}
                >
                  {Array.from(new Set(mockContainers.map((c) => c.subType))).map((st) => (
                    <MenuItem key={st} value={st}>{st}</MenuItem>
                  ))}
                </TextField>
              )}
            </Box>

            <Divider sx={{ borderColor: '#f0f0f0', mb: 1.75 }} />

            {/* Station Configuration */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
              <TuneOutlinedIcon sx={{ fontSize: 18, color: PRIMARY }} />
              <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1a2332' }}>
                Station Configuration
              </Typography>
            </Box>
            <StationConfigSection
              cfg={puCfg}
              onChange={(c) => setPuCfg((p) => ({ ...p, ...c }))}
              label="Pickup"
              icon={<LocalShippingOutlinedIcon sx={{ fontSize: 18 }} />}
              actionOptions={[{ value: 'pick', label: 'Pick' }, { value: 'auto-hitch', label: 'Auto-hitch' }]}
            />
            <StationConfigSection
              cfg={dropCfg}
              onChange={(c) => setDropCfg((p) => ({ ...p, ...c }))}
              label="Drop"
              icon={<FmdGoodOutlinedIcon sx={{ fontSize: 18 }} />}
              actionOptions={[{ value: 'drop', label: 'Drop' }, { value: 'auto-unhitch', label: 'Auto-unhitch' }]}
            />
          </Box>
        )}

        {/* ── STEP 4: Review ──────────────────────────── */}
        {stepName === 'Review' && (
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <CheckCircleOutlinedIcon sx={{ fontSize: 20, color: PRIMARY }} />
              <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332' }}>
                Review your workflow configuration
              </Typography>
            </Box>

            {/* Basics */}
            <Paper variant="outlined" sx={{ borderRadius: 1.5, mb: 2, overflow: 'hidden' }}>
              <Box sx={{ px: 2, py: 1, bgcolor: '#f9fafb', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1 }}>
                <AssignmentOutlinedIcon sx={{ fontSize: 16, color: PRIMARY }} />
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1a2332', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Basics
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 0.5 }}>
                <ReviewRow label="Workflow Name" value={name || '—'} />
                <ReviewRow label="Production Unit" value={productionUnit || '—'} />
                <ReviewRow label="Order Type" value={orderType === 'single' ? 'Single' : 'Fulfillment'} />
                <ReviewRow label="Fleet" value={fleet} />
              </Box>
            </Paper>

            {/* Order Config */}
            <Paper variant="outlined" sx={{ borderRadius: 1.5, mb: 2, overflow: 'hidden' }}>
              <Box sx={{ px: 2, py: 1, bgcolor: '#f9fafb', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 1 }}>
                {orderCategory === 'material'
                  ? <WidgetsOutlinedIcon sx={{ fontSize: 16, color: PRIMARY }} />
                  : <Inventory2OutlinedIcon sx={{ fontSize: 16, color: PRIMARY }} />}
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1a2332', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {orderCategory === 'material' ? 'Material Order' : 'Container Order'}
                </Typography>
              </Box>
              <Box sx={{ px: 2, py: 0.5 }}>
                <ReviewRow label="Assignment Strategy" value={strategy === 'request-based' ? 'Request-based' : 'On-route'} />
                {strategy === 'on-route' && (
                  <ReviewRow label="Execution Trigger" value={trigger === 'dispatch' ? 'Dispatch Button' : 'QR Code Scan'} />
                )}
                {orderCategory === 'material' && (
                  <>
                    <ReviewRow label="Material Scope" value={matScope === 'sku' ? 'SKU Name' : matScope === 'alias' ? 'Alias Name' : 'Parent Material'} />
                    {matScope === 'sku' && selectedSkus.length > 0 && (
                      <ReviewRow label="Selected SKUs" value={selectedSkus.map((id) => mockSkus.find((s) => s.id === id)?.name ?? id).join(', ')} />
                    )}
                    {matScope === 'alias' && selectedAliases.length > 0 && (
                      <ReviewRow label="Selected Aliases" value={selectedAliases.join(', ')} />
                    )}
                    {matScope === 'parent' && selectedParents.length > 0 && (
                      <ReviewRow label="Parent Materials" value={selectedParents.map((id) => mockSkus.find((s) => s.id === id)?.name ?? id).join(', ')} />
                    )}
                  </>
                )}
                {orderCategory === 'container' && (
                  <>
                    <ReviewRow label="Trolley Scope" value={trolleyScope === 'from-sku' ? 'From SKU' : 'Manual'} />
                    {trolleyScope === 'manual' && selectedTrolleys.length > 0 && (
                      <ReviewRow label="Selected Trolleys" value={selectedTrolleys.join(', ')} />
                    )}
                  </>
                )}
                <ReviewRow label="Pickup Station" value={puCfg.mode === 'static' ? 'Manual' : `Mapping (${puCfg.mappingId})`} />
                <ReviewRow label="Pickup Action" value={puCfg.actionType} />
                <ReviewRow label="Drop Station" value={dropCfg.mode === 'static' ? 'Static' : `Mapping (${dropCfg.mappingId})`} />
                <ReviewRow label="Drop Action" value={dropCfg.actionType} />
              </Box>
            </Paper>
          </Box>
        )}
      </DialogContent>

      {/* ── Actions ───────────────────────────────────── */}
      <Divider sx={{ borderColor: '#f0f0f0', flexShrink: 0 }} />
      <DialogActions sx={{ px: 3, py: 1.5, gap: 1, flexShrink: 0 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none', fontWeight: 500 }}>
          Cancel
        </Button>
        {step === 0 && (
          <Typography sx={{ fontSize: '0.8rem', color: (orderMaterial || orderContainer) ? PRIMARY : '#9EA8B3', ml: 1 }}>
            {!orderMaterial && !orderContainer
              ? 'Select at least one order type to continue'
              : orderMaterial && orderContainer
                ? 'Both order types selected'
                : orderMaterial ? 'Order Material selected' : 'Order Container selected'}
          </Typography>
        )}
        <Box sx={{ flex: 1 }} />
        {step > 0 && (
          <Button variant="outlined" onClick={handleBack}
            sx={{ textTransform: 'none', borderColor: '#e0e0e0', color: '#1a2332', fontWeight: 500 }}>
            Back
          </Button>
        )}
        {!isLast ? (
          <Button variant="contained" onClick={handleNext} disabled={!canNext}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: PRIMARY, '&:hover': { bgcolor: '#009688' }, boxShadow: 'none',
              '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' } }}>
            Next
          </Button>
        ) : (
          <Button variant="contained" onClick={handleSave} disabled={!name.trim()}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: PRIMARY, '&:hover': { bgcolor: '#009688' }, boxShadow: 'none', px: 3 }}>
            {isEdit ? 'Save Changes' : 'Create Workflow'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
