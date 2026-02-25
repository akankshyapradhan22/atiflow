import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import DoneIcon from '@mui/icons-material/Done';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { mockMaterials, mockContainers } from '../../data/mock';
import type { CartItem } from '../../types';

interface SubSkuRow {
  subSkuTypeId: string;
  quantity: number;
}

/* ── Shared sub-components ── */

function BranchConnector({ isLast }: { isLast: boolean }) {
  return (
    <Box sx={{ width: 40, flexShrink: 0, alignSelf: 'stretch', position: 'relative' }}>
      <Box sx={{ position: 'absolute', left: 10, top: 0, bottom: '50%', borderLeft: '1.5px solid #BDBDBD' }} />
      <Box sx={{ position: 'absolute', left: 10, top: '50%', width: 20, borderTop: '1.5px solid #BDBDBD' }} />
      <Box sx={{
        position: 'absolute', left: 29, top: '50%', transform: 'translateY(-50%)',
        width: 0, height: 0,
        borderTop: '4px solid transparent', borderBottom: '4px solid transparent',
        borderLeft: '5px solid #BDBDBD',
      }} />
      {!isLast && (
        <Box sx={{ position: 'absolute', left: 10, top: '50%', bottom: 0, borderLeft: '1.5px solid #BDBDBD' }} />
      )}
    </Box>
  );
}

function LabelChip({
  icon: Icon, label, selected = false, minWidth = 100, labelMaxWidth = 80,
}: {
  icon: React.ElementType; label: string; selected?: boolean; minWidth?: number; labelMaxWidth?: number;
}) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
      height: 42, px: '11px',
      bgcolor: selected ? 'rgba(0,169,157,0.15)' : '#f2f2f2',
      border: `1px solid ${selected ? '#00a99d' : '#c1c1c1'}`,
      borderRadius: '6px',
      flexShrink: 0,
      minWidth,
    }}>
      <Icon sx={{ fontSize: 20, color: selected ? '#00a99d' : 'rgba(26,35,50,0.74)' }} />
      <Typography sx={{
        fontFamily: '"IBM Plex Mono", monospace',
        fontWeight: 600,
        fontSize: '0.8125rem',
        color: selected ? '#1A2332' : 'rgba(26,35,50,0.74)',
        whiteSpace: 'nowrap',
        maxWidth: labelMaxWidth,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {label}
      </Typography>
    </Box>
  );
}

const selectSx = {
  height: 42,
  bgcolor: '#fff',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#cacaca', borderRadius: '6px' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#aaa' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#00a99d' },
  '& .MuiSelect-select': { py: '11px', px: '10px', fontSize: '0.875rem', color: '#1A2332' },
  '&.Mui-disabled .MuiOutlinedInput-notchedOutline': { borderColor: '#e8e8e8' },
};

/* ── Wizard Stepper ── */
function WizardStepper({ step }: { step: number }) {
  // Exact pixel positions from Figma (Frame 266: 678×42px, left: 246px)
  const circles = [
    { left: 43,  label: 'Request Material',       labelLeft: 0   },
    { left: 248, label: 'Return Empty\nContainer', labelLeft: 185 },
    { left: 458, label: 'Request Summary',         labelLeft: 411 },
    { left: 636, label: 'Confirmation',            labelLeft: 604 },
  ];
  // Progress line starts at left: 49px; widths to each circle center
  const progressWidth = step === 1 ? 0 : step === 2 ? 207 : step === 3 ? 417 : 593;

  return (
    <Box sx={{ py: 1.5, pl: '44px' }}>
      <Box sx={{ position: 'relative', height: 42, width: 678 }}>
        {/* Grey background line */}
        <Box sx={{ position: 'absolute', top: 9, left: 49, width: 593, height: '2px', bgcolor: 'rgba(99,115,129,0.25)', zIndex: 0 }} />
        {/* Teal progress line */}
        {step > 1 && (
          <Box sx={{ position: 'absolute', top: 9, left: 49, width: progressWidth, height: '2px', bgcolor: '#00a99d', zIndex: 0, transition: 'width 0.25s ease' }} />
        )}
        {/* Circles */}
        {circles.map((c, i) => {
          const num = i + 1;
          const teal = step >= num;
          return (
            <Box key={`c${num}`} sx={{
              position: 'absolute', top: 2, left: c.left,
              width: 16, height: 16, borderRadius: '50%',
              bgcolor: teal ? '#00a99d' : '#e8e8e8',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
            }}>
              <Typography sx={{ fontSize: '0.625rem', fontWeight: 400, color: teal ? '#fff' : '#9E9E9E', lineHeight: 1 }}>
                {num}
              </Typography>
            </Box>
          );
        })}
        {/* Labels */}
        {circles.map((c, i) => (
          <Typography key={`l${i}`} sx={{
            position: 'absolute', top: 23, left: c.labelLeft,
            fontSize: '0.75rem', fontWeight: 400, color: '#1A2332',
            lineHeight: '19px', whiteSpace: 'pre-line',
          }}>
            {c.label}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

/* ── Reusable footer buttons ── */
function NextButton({ onClick, disabled, label = 'Next' }: { onClick: () => void; disabled?: boolean; label?: string }) {
  return (
    <Button
      variant="contained"
      disabled={disabled}
      onClick={onClick}
      endIcon={
        <Box sx={{
          width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <ArrowForwardIcon sx={{ fontSize: 16, color: !disabled ? '#00a99d' : '#bfbfbf' }} />
        </Box>
      }
      sx={{
        bgcolor: !disabled ? '#00a99d' : '#bfbfbf',
        '&:hover': { bgcolor: !disabled ? '#00897b' : '#bfbfbf' },
        '&.Mui-disabled': { bgcolor: '#bfbfbf', color: '#fff' },
        borderRadius: '8px', px: 2, py: '10px',
        fontWeight: 600, fontSize: '1rem', textTransform: 'none',
        gap: 1, minWidth: 120,
      }}
    >
      {label}
    </Button>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outlined"
      onClick={onClick}
      startIcon={
        <Box sx={{
          width: 32, height: 32, borderRadius: '50%', bgcolor: '#fff',
          border: '1px solid #cfcfcf',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <ArrowForwardIcon sx={{ fontSize: 16, color: '#1A2332', transform: 'rotate(180deg)' }} />
        </Box>
      }
      sx={{
        bgcolor: '#fff', borderColor: '#cfcfcf', color: '#1A2332',
        '&:hover': { borderColor: '#aaa', bgcolor: '#f5f5f5' },
        borderRadius: '8px', px: 2, py: '10px',
        fontWeight: 600, fontSize: '1rem', textTransform: 'none',
        gap: 1, minWidth: 120,
      }}
    >
      Back
    </Button>
  );
}

/* ── Page ── */
export default function CreateRequestPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { addToCart, clearCart } = useCartStore();
  const cart = useCartStore((s) => s.cart);

  // Step control
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: material selection state
  const [selectedSkuId, setSelectedSkuId] = useState('');
  const [rows, setRows] = useState<SubSkuRow[]>([
    { subSkuTypeId: '', quantity: 0 },
    { subSkuTypeId: '', quantity: 0 },
    { subSkuTypeId: '', quantity: 0 },
  ]);

  // Step 2: return container state
  const [containerTypeId, setContainerTypeId] = useState(mockContainers[0].id);
  const [returnSelections, setReturnSelections] = useState<Set<string>>(new Set());

  const selectedSku = mockMaterials.find(m => m.id === selectedSkuId);
  const activeRows = rows.filter(r => r.subSkuTypeId && r.quantity > 0);
  const hasItems = activeRows.length > 0;
  const selectedContainer = mockContainers.find(c => c.id === containerTypeId);

  /* Step 1 handlers */
  const handleSkuChange = (skuId: string) => {
    setSelectedSkuId(skuId);
    setRows([
      { subSkuTypeId: '', quantity: 0 },
      { subSkuTypeId: '', quantity: 0 },
      { subSkuTypeId: '', quantity: 0 },
    ]);
  };

  const handleSubSkuChange = (rowIdx: number, subSkuTypeId: string) => {
    setRows(prev => prev.map((r, i) =>
      i === rowIdx ? { ...r, subSkuTypeId, quantity: subSkuTypeId ? 1 : 0 } : r
    ));
  };

  const handleQtyChange = (rowIdx: number, delta: number) => {
    setRows(prev => prev.map((r, i) => {
      if (i !== rowIdx || !r.subSkuTypeId) return r;
      const sst = selectedSku?.subSkuTypes.find(s => s.id === r.subSkuTypeId);
      const max = sst?.maxQty ?? 99;
      return { ...r, quantity: Math.max(1, Math.min(max, r.quantity + delta)) };
    }));
  };

  const handleStep1Next = () => {
    clearCart();
    rows.forEach(r => {
      if (!r.subSkuTypeId || r.quantity === 0 || !selectedSku) return;
      const sst = selectedSku.subSkuTypes.find(s => s.id === r.subSkuTypeId);
      if (!sst) return;
      const item: CartItem = {
        subSkuTypeId: sst.id,
        subSkuTypeName: sst.name,
        skuName: selectedSku.name,
        quantity: r.quantity,
        maxQty: sst.maxQty,
      };
      addToCart(item);
    });
    setStep(2);
  };

  /* Step 2 handlers */
  const toggleReturnSelection = (subSkuTypeId: string) => {
    setReturnSelections(prev => {
      const next = new Set(prev);
      if (next.has(subSkuTypeId)) next.delete(subSkuTypeId);
      else next.add(subSkuTypeId);
      return next;
    });
  };

  /* Step 1 footer status */
  const firstActive = activeRows[0];
  const firstActiveSst = firstActive
    ? selectedSku?.subSkuTypes.find(s => s.id === firstActive.subSkuTypeId)
    : null;
  const statusText = hasItems && firstActiveSst
    ? `${firstActive.quantity} Units  of  Sub-SKU: ${firstActiveSst.name}  added`
    : null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* Fixed header */}
      <Box sx={{ px: 3, pt: 2, pb: 0, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
          <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>
            {user?.stationId ?? 'Station 001'}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: '#9E9E9E' }} />
          <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>
            Make New Request
          </Typography>
        </Box>
        <WizardStepper step={step} />
        <Divider />
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', px: 3, pt: 2, pb: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>

        {/* ── Step 1: Request Material ── */}
        {step === 1 && (
          <>
            {/* SKU parent row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
              <LabelChip
                icon={GridViewOutlinedIcon}
                label={selectedSku?.code ?? 'SKU'}
                selected={!!selectedSkuId}
                minWidth={110}
              />
              <Select
                value={selectedSkuId}
                onChange={e => handleSkuChange(e.target.value)}
                displayEmpty
                size="small"
                renderValue={val => val
                  ? mockMaterials.find(m => m.id === val)?.name
                  : <Typography sx={{ color: 'rgba(26,35,50,0.43)', fontSize: '0.875rem', fontStyle: 'italic' }}>Please select SKU</Typography>
                }
                sx={{ ...selectSx, width: 440 }}
              >
                {mockMaterials.map(m => (
                  <MenuItem key={m.id} value={m.id} sx={{ fontSize: '0.875rem' }}>
                    {m.name} ({m.code})
                  </MenuItem>
                ))}
              </Select>

              {/* Quantity column header */}
              <Typography sx={{
                ml: 'auto', minWidth: 176, textAlign: 'center',
                color: 'rgba(26,35,50,0.74)', fontWeight: 500, fontSize: '0.875rem',
              }}>
                Quantity
              </Typography>
            </Box>

            {/* Sub-SKU branch rows */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {rows.map((row, idx) => {
                const selectedSst = selectedSku?.subSkuTypes.find(s => s.id === row.subSkuTypeId);
                const maxQty = selectedSst?.maxQty ?? 99;
                const hasQty = row.quantity > 0 && !!row.subSkuTypeId;
                const isLast = idx === rows.length - 1;

                return (
                  <Box key={idx} sx={{ display: 'flex', alignItems: 'stretch', minHeight: 66 }}>
                    <BranchConnector isLast={isLast} />

                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.75, py: 1 }}>
                      <LabelChip
                        icon={ExtensionOutlinedIcon}
                        label={selectedSst?.name ?? 'Sub-SKU'}
                        selected={!!row.subSkuTypeId}
                        minWidth={130}
                      />

                      <Select
                        value={row.subSkuTypeId}
                        onChange={e => handleSubSkuChange(idx, e.target.value)}
                        displayEmpty
                        disabled={!selectedSkuId}
                        size="small"
                        renderValue={val => val
                          ? selectedSku?.subSkuTypes.find(s => s.id === val)?.name
                          : <Typography sx={{ color: 'rgba(26,35,50,0.43)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                              {selectedSkuId ? 'Select sub-SKU type' : 'Please select SKU for item selection'}
                            </Typography>
                        }
                        sx={{ ...selectSx, flex: 1 }}
                      >
                        {(selectedSku?.subSkuTypes ?? []).map(sst => (
                          <MenuItem key={sst.id} value={sst.id} sx={{ fontSize: '0.875rem' }}>
                            {sst.name} ({sst.available} avail.)
                          </MenuItem>
                        ))}
                      </Select>

                      {/* Quantity stepper */}
                      <Box sx={{
                        display: 'flex', alignItems: 'center',
                        width: 176, height: 42, flexShrink: 0,
                        bgcolor: '#fff', border: '1px solid #cacaca', borderRadius: '8px',
                        overflow: 'hidden',
                      }}>
                        <IconButton
                          size="small"
                          disabled={!row.subSkuTypeId || row.quantity <= 1}
                          onClick={() => handleQtyChange(idx, -1)}
                          sx={{
                            width: 32, height: 32, m: '5px', borderRadius: '50%', p: 0, flexShrink: 0,
                            bgcolor: row.subSkuTypeId && row.quantity > 1 ? '#EF5350' : '#e0e0e0',
                            color: '#fff',
                            '&:hover': { bgcolor: row.subSkuTypeId && row.quantity > 1 ? '#D32F2F' : '#e0e0e0' },
                            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#bdbdbd' },
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 14 }} />
                        </IconButton>

                        <Box sx={{ flex: 1, textAlign: 'center', px: 0.5 }}>
                          {hasQty ? (
                            <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#1A2332' }}>
                              {row.quantity}
                            </Typography>
                          ) : (
                            <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(26,35,50,0.43)', fontStyle: 'italic' }}>
                              Add Items
                            </Typography>
                          )}
                        </Box>

                        <IconButton
                          size="small"
                          disabled={!row.subSkuTypeId || row.quantity >= maxQty}
                          onClick={() => handleQtyChange(idx, 1)}
                          sx={{
                            width: 32, height: 32, m: '5px', borderRadius: '50%', p: 0, flexShrink: 0,
                            bgcolor: row.subSkuTypeId ? '#d7f5f3' : '#e0e0e0',
                            color: row.subSkuTypeId ? '#00a99d' : '#bdbdbd',
                            '&:hover': { bgcolor: row.subSkuTypeId ? '#b2ebe0' : '#e0e0e0' },
                            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#bdbdbd' },
                          }}
                        >
                          <AddIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </>
        )}

        {/* ── Step 2: Return Empty Container ── */}
        {step === 2 && (
          <>
            <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1A2332', mb: 1.5 }}>
              Return Empty Container
            </Typography>

            {/* Container type row */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
              <LabelChip
                icon={Inventory2OutlinedIcon}
                label="Container"
                selected={true}
                minWidth={120}
                labelMaxWidth={90}
              />
              <Select
                value={containerTypeId}
                onChange={e => setContainerTypeId(e.target.value)}
                size="small"
                sx={{ ...selectSx, width: 440 }}
              >
                {mockContainers.map(c => (
                  <MenuItem key={c.id} value={c.id} sx={{ fontSize: '0.875rem' }}>
                    {c.type.charAt(0).toUpperCase() + c.type.slice(1)}
                  </MenuItem>
                ))}
              </Select>
              <Typography sx={{
                ml: 'auto', minWidth: 42, textAlign: 'center',
                color: 'rgba(26,35,50,0.74)', fontWeight: 500, fontSize: '0.875rem',
              }}>
                Select
              </Typography>
            </Box>

            {/* Sub-SKU rows with select toggles */}
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              {activeRows.map((row, idx) => {
                const sst = selectedSku?.subSkuTypes.find(s => s.id === row.subSkuTypeId);
                const isSelected = returnSelections.has(row.subSkuTypeId);
                const isLast = idx === activeRows.length - 1;
                return (
                  <Box key={row.subSkuTypeId} sx={{ display: 'flex', alignItems: 'stretch', minHeight: 66 }}>
                    <BranchConnector isLast={isLast} />
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.75, py: 1 }}>
                      <LabelChip
                        icon={ExtensionOutlinedIcon}
                        label={sst?.name ?? row.subSkuTypeId}
                        selected={true}
                        minWidth={130}
                        labelMaxWidth={110}
                      />
                      <Box sx={{ flex: 1 }} />
                      {/* Toggle button */}
                      <Box
                        onClick={() => toggleReturnSelection(row.subSkuTypeId)}
                        sx={{
                          width: 42, height: 42, flexShrink: 0,
                          borderRadius: '8px',
                          bgcolor: isSelected ? 'rgba(0,169,157,0.11)' : '#eeeeee',
                          border: `2px solid ${isSelected ? '#00a99d' : '#cdcdcd'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s, border-color 0.15s',
                          '&:hover': { bgcolor: isSelected ? 'rgba(0,169,157,0.18)' : '#e0e0e0' },
                        }}
                      >
                        {isSelected && (
                          <Box sx={{
                            width: 24, height: 24, borderRadius: '50%',
                            bgcolor: '#00a99d',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <DoneIcon sx={{ fontSize: 14, color: '#fff' }} />
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </>
        )}

        {/* ── Step 3: Request Summary ── */}
        {step === 3 && (
          <>
            {/* Page heading */}
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1A2332', mb: 2 }}>
              Request Summary
            </Typography>

            {/* Section header: "1. Material" + "Quantity" label */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: '#1A2332' }}>
                1. Material
              </Typography>
              <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: 'rgba(26,35,50,0.74)' }}>
                Quantity
              </Typography>
            </Box>

            {/* Material items */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              {cart.map(item => (
                <Box key={item.subSkuTypeId} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  {/* Left: SKU label pill + Sub-SKU row */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                    {/* Grey SKU label pill */}
                    <Box sx={{
                      bgcolor: '#f1f1f1', border: '1px solid #cacaca', borderRadius: '6px',
                      height: 24, px: '10px', display: 'flex', alignItems: 'center',
                    }}>
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.75rem', color: '#1a2332' }}>
                        {selectedSku?.code ?? item.skuName}
                      </Typography>
                    </Box>
                    {/* Sub-SKU chip + name row */}
                    <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                      <Box sx={{
                        bgcolor: 'rgba(0,169,157,0.14)', border: '1px solid #00a99d', borderRadius: '6px',
                        height: 40, px: '7px', py: '1px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      }}>
                        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '0.875rem', color: 'rgba(26,35,50,0.74)' }}>
                          Sub-SKU
                        </Typography>
                      </Box>
                      <Box sx={{
                        bgcolor: '#fff', border: '1px solid #cacaca', borderRadius: '6px',
                        height: 40, px: '10px', py: '6px', flex: 1,
                        display: 'flex', alignItems: 'center',
                      }}>
                        <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '0.875rem', color: '#1a2332' }}>
                          {item.subSkuTypeName}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  {/* Right: large quantity number + Units chip */}
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
                    <Box sx={{
                      bgcolor: '#fff', border: '1px solid #cacaca', borderRadius: '8px',
                      width: 131, height: 76,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '2.25rem', color: '#1a2332', lineHeight: 1 }}>
                        {item.quantity}
                      </Typography>
                    </Box>
                    <Box sx={{
                      bgcolor: '#f2f2f2', border: '1px solid #c1c1c1', borderRadius: '6px',
                      height: 76, px: '7px', py: '1px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.75rem', color: 'rgba(26,35,50,0.74)' }}>
                        Units
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>

            <Divider sx={{ my: 2.5 }} />

            {/* Section heading: "2. Return Empty Container" */}
            <Typography sx={{ fontWeight: 500, fontSize: '1rem', color: '#1A2332', mb: 1.5 }}>
              2. Return Empty Container
            </Typography>

            {returnSelections.size === 0 ? (
              <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.45)', fontStyle: 'italic' }}>
                Skipped
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {Array.from(returnSelections).map(subSkuTypeId => {
                  const sst = selectedSku?.subSkuTypes.find(s => s.id === subSkuTypeId);
                  const containerLabel = selectedContainer
                    ? selectedContainer.type.charAt(0).toUpperCase() + selectedContainer.type.slice(1)
                    : 'Container';
                  return (
                    <Box key={subSkuTypeId} sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                      {/* Left: Container label pill + Sub-SKU row */}
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1 }}>
                        {/* Grey container type label pill */}
                        <Box sx={{
                          bgcolor: '#f1f1f1', border: '1px solid #cacaca', borderRadius: '6px',
                          height: 24, px: '10px', display: 'flex', alignItems: 'center',
                        }}>
                          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.75rem', color: '#1a2332' }}>
                            {containerLabel}
                          </Typography>
                        </Box>
                        {/* Sub-SKU chip + name row */}
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Box sx={{
                            bgcolor: 'rgba(0,169,157,0.14)', border: '1px solid #00a99d', borderRadius: '6px',
                            height: 40, px: '7px', py: '1px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '0.875rem', color: 'rgba(26,35,50,0.74)' }}>
                              Sub-SKU
                            </Typography>
                          </Box>
                          <Box sx={{
                            bgcolor: '#fff', border: '1px solid #cacaca', borderRadius: '6px',
                            height: 40, px: '10px', py: '6px', flex: 1,
                            display: 'flex', alignItems: 'center',
                          }}>
                            <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '0.875rem', color: '#1a2332' }}>
                              {sst?.name ?? subSkuTypeId}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      {/* Right: quantity 1 + Units chip */}
                      <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexShrink: 0 }}>
                        <Box sx={{
                          bgcolor: '#fff', border: '1px solid #cacaca', borderRadius: '8px',
                          width: 131, height: 76,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '2.25rem', color: '#1a2332', lineHeight: 1 }}>
                            1
                          </Typography>
                        </Box>
                        <Box sx={{
                          bgcolor: '#f2f2f2', border: '1px solid #c1c1c1', borderRadius: '6px',
                          height: 76, px: '7px', py: '1px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.75rem', color: 'rgba(26,35,50,0.74)' }}>
                            Units
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            )}
          </>
        )}

        {/* ── Step 4: Confirmation ── */}
        {step === 4 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pt: 2 }}>
            {/* Solid teal circle with white checkmark */}
            <Box sx={{
              width: 93, height: 93, borderRadius: '50%',
              bgcolor: '#00a99d',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              mb: 2,
            }}>
              <DoneIcon sx={{ fontSize: 52, color: '#fff' }} />
            </Box>

            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1A2332', mb: 0.75 }}>
              Request confirmed!
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#1A2332', mb: 3, textAlign: 'center' }}>
              AMR will be assigned shortly to fulfill your request
            </Typography>

            {/* View Request button — outlined, in content area */}
            <Button
              variant="outlined"
              onClick={() => navigate('/history')}
              sx={{
                bgcolor: '#fff', borderColor: '#919191', color: '#1A2332',
                '&:hover': { borderColor: '#555', bgcolor: '#f5f5f5' },
                borderRadius: '8px', px: 3, py: '10px',
                fontWeight: 600, fontSize: '1rem', textTransform: 'none',
                minWidth: 133, mb: 4,
                boxShadow: 'none',
              }}
            >
              View Request
            </Button>

            {/* Summary table */}
            <Box sx={{ width: '100%', border: '1px solid #e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
              {/* Grey header row */}
              <Box sx={{
                bgcolor: '#f1f1f1', borderBottom: '1px solid #e0e0e0',
                height: 33, px: '12px', display: 'flex', alignItems: 'center',
              }}>
                <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'rgba(26,35,50,0.54)' }}>
                  Summary
                </Typography>
              </Box>
              {/* Data row — exact pixel positions from Figma spec (card body: 83px) */}
              <Box sx={{ position: 'relative', height: 83 }}>
                {/* Material: left:12, label top:16, value top:46 */}
                <Box sx={{ position: 'absolute', left: 12, top: 16 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'rgba(26,35,50,0.54)', lineHeight: '19px', mb: '11px' }}>
                    Material
                  </Typography>
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '1rem', color: '#1A2332', lineHeight: '19px' }}>
                    {selectedSku?.code ?? cart[0]?.skuName ?? '—'}
                  </Typography>
                </Box>
                {/* Quantity: left:193 */}
                <Box sx={{ position: 'absolute', left: 193, top: 16 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: 'rgba(26,35,50,0.54)', lineHeight: '19px', mb: '11px' }}>
                    Quantity
                  </Typography>
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600, fontSize: '1rem', color: '#1A2332', lineHeight: '19px' }}>
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} units
                  </Typography>
                </Box>
                {/* Single vertical divider: left:327, top:10, height:61 */}
                <Box sx={{ position: 'absolute', left: 327, top: 10, width: '1px', height: 61, bgcolor: 'rgba(99,115,129,0.24)' }} />
                {/* Return Empty Container: left:375 */}
                <Box sx={{ position: 'absolute', left: 375, top: 16, right: 12 }}>
                  <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#1A2332', lineHeight: '19px', mb: '11px' }}>
                    Return Empty Container:
                  </Typography>
                  <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1A2332', lineHeight: '19px' }}>
                    {returnSelections.size > 0
                      ? `Container ${selectedContainer ? selectedContainer.type.charAt(0).toUpperCase() + selectedContainer.type.slice(1) : ''} for SKU ${selectedSku?.code ?? '—'}`
                      : '—'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{
        px: 3, py: 1.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        bgcolor: '#fff', flexShrink: 0,
      }}>

        {/* Step 1 footer */}
        {step === 1 && (
          <>
            {statusText ? (
              <Typography sx={{ fontSize: '0.875rem', color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace', fontWeight: 600 }}>
                {statusText}
              </Typography>
            ) : (
              <Typography sx={{ fontSize: '0.875rem', color: '#696a6b', fontStyle: 'italic' }}>
                Please add items to proceed
              </Typography>
            )}
            <NextButton onClick={handleStep1Next} disabled={!hasItems} />
          </>
        )}

        {/* Step 2 footer */}
        {step === 2 && (
          <>
            <BackButton onClick={() => setStep(1)} />
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => { setReturnSelections(new Set()); setStep(3); }}
                endIcon={
                  <Box sx={{
                    width: 32, height: 32, borderRadius: '6px',
                    bgcolor: '#f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <KeyboardDoubleArrowRightIcon sx={{ fontSize: 16, color: '#1A2332' }} />
                  </Box>
                }
                sx={{
                  bgcolor: '#fff', borderColor: '#cfcfcf', color: '#1A2332',
                  '&:hover': { borderColor: '#aaa', bgcolor: '#f5f5f5' },
                  borderRadius: '8px', px: 2, py: '10px',
                  fontWeight: 600, fontSize: '1rem', textTransform: 'none',
                  gap: 1, minWidth: 120,
                }}
              >
                Skip
              </Button>
              <NextButton onClick={() => setStep(3)} />
            </Box>
          </>
        )}

        {/* Step 3 footer */}
        {step === 3 && (
          <>
            <Typography sx={{ fontSize: '0.875rem', color: '#696a6b', fontStyle: 'italic' }}>
              Please confirm to place the request
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <BackButton onClick={() => setStep(2)} />
              <NextButton onClick={() => setStep(4)} label="Confirm" />
            </Box>
          </>
        )}

        {/* Step 4 footer — empty, button is in content area */}
      </Box>
    </Box>
  );
}
