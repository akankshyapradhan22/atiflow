import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckIcon from '@mui/icons-material/Check';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { mockContainers } from '../../data/mock';
import type { ContainerCartItem } from '../../types';

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
  icon: Icon, label, selected = false, minWidth = 100,
}: {
  icon: React.ElementType; label: string; selected?: boolean; minWidth?: number;
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
        maxWidth: 160,
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

/* ── Page ── */

export default function ContainerSelectionPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const setContainerCart = useCartStore((s) => s.setContainerCart);
  const clearContainerCart = useCartStore((s) => s.clearContainerCart);

  const [selectedContainerId, setSelectedContainerId] = useState('');
  const [selectedSubtypes, setSelectedSubtypes] = useState<Set<string>>(new Set());

  const selectedContainer = mockContainers.find(c => c.id === selectedContainerId);
  const hasSelection = selectedSubtypes.size > 0;

  const containerTypeName = (type: string) =>
    type.charAt(0).toUpperCase() + type.slice(1);

  const handleContainerChange = (containerId: string) => {
    setSelectedContainerId(containerId);
    setSelectedSubtypes(new Set());
  };

  const toggleSubtype = (subtypeId: string) => {
    setSelectedSubtypes(prev => {
      const next = new Set(prev);
      if (next.has(subtypeId)) next.delete(subtypeId);
      else next.add(subtypeId);
      return next;
    });
  };

  const handleNext = () => {
    if (!selectedContainer) return;
    const items: ContainerCartItem[] = Array.from(selectedSubtypes).map(subtypeId => {
      const subtype = selectedContainer.subtypes.find(s => s.id === subtypeId)!;
      return {
        containerId: selectedContainer.id,
        containerType: selectedContainer.type,
        subtypeId,
        subtypeName: subtype.name,
        quantity: 1,
      };
    });
    setContainerCart(items);
    navigate('/history/checkout');
  };

  const handleSkip = () => {
    clearContainerCart();
    navigate('/history/checkout');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>

      {/* Header */}
      <Box sx={{ px: 3, pt: 2, pb: 0.5, flexShrink: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.75 }}>
          <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>
            {user?.stationId ?? 'Station 001'}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: '#9E9E9E' }} />
          <Typography sx={{ fontSize: '1rem', color: '#1A2332', fontWeight: 500 }}>
            Make New Request
          </Typography>
        </Box>
        <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1A2332', mb: 1.25 }}>
          Request Container
        </Typography>
        <Divider />
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', px: 3, pt: 2, pb: 1, minHeight: 0 }}>

        {/* Container parent row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75 }}>
          <LabelChip
            icon={GridViewOutlinedIcon}
            label="Container"
            selected={false}
            minWidth={120}
          />
          <Select
            value={selectedContainerId}
            onChange={e => handleContainerChange(e.target.value)}
            displayEmpty
            size="small"
            renderValue={val => val
              ? containerTypeName(mockContainers.find(c => c.id === val)!.type)
              : <Typography sx={{ color: 'rgba(26,35,50,0.43)', fontSize: '0.875rem', fontStyle: 'italic' }}>Please select container type</Typography>
            }
            sx={{ ...selectSx, width: 440 }}
          >
            {mockContainers.map(c => (
              <MenuItem key={c.id} value={c.id} sx={{ fontSize: '0.875rem' }}>
                {containerTypeName(c.type)}
              </MenuItem>
            ))}
          </Select>

          {/* "Select" column header – aligns over checkboxes */}
          <Typography sx={{
            ml: 'auto', minWidth: 42, textAlign: 'center',
            color: 'rgba(26,35,50,0.74)', fontWeight: 500, fontSize: '0.875rem',
          }}>
            Select
          </Typography>
        </Box>

        {/* Sub-type branch rows */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {(selectedContainer?.subtypes ?? []).map((subtype, idx) => {
            const isSelected = selectedSubtypes.has(subtype.id);
            const isLast = idx === (selectedContainer?.subtypes.length ?? 1) - 1;

            return (
              <Box key={subtype.id} sx={{ display: 'flex', alignItems: 'stretch', minHeight: 66 }}>
                <BranchConnector isLast={isLast} />

                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.75, py: 1 }}>
                  <LabelChip
                    icon={ExtensionOutlinedIcon}
                    label={subtype.name}
                    selected={isSelected}
                    minWidth={140}
                  />

                  {/* Spacer */}
                  <Box sx={{ flex: 1 }} />

                  {/* Checkbox */}
                  <Box
                    onClick={() => toggleSubtype(subtype.id)}
                    sx={{
                      width: 42, height: 42, borderRadius: '8px', flexShrink: 0,
                      bgcolor: isSelected ? 'rgba(0,169,157,0.11)' : '#eee',
                      border: `2px solid ${isSelected ? '#00a99d' : '#cdcdcd'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.12s',
                      '&:hover': { borderColor: isSelected ? '#00897b' : '#aaa' },
                    }}
                  >
                    {isSelected && <CheckIcon sx={{ fontSize: 22, color: '#00a99d' }} />}
                  </Box>
                </Box>
              </Box>
            );
          })}

          {/* Empty state hint when no container selected */}
          {!selectedContainerId && (
            <Box sx={{ pl: '40px', pt: 1 }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(26,35,50,0.43)', fontStyle: 'italic' }}>
                Select a container type to see available sub-types
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{
        px: 3, py: 1.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        bgcolor: '#fff', flexShrink: 0,
      }}>
        {/* Back */}
        <Button
          variant="outlined"
          onClick={() => navigate('/history/return-trolley')}
          startIcon={
            <Box sx={{
              width: 32, height: 32, borderRadius: '50%',
              bgcolor: 'rgba(26,35,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ArrowForwardIcon sx={{ fontSize: 16, color: '#1A2332', transform: 'rotate(180deg)' }} />
            </Box>
          }
          sx={{
            bgcolor: '#fff', color: '#1A2332', borderColor: '#cfcfcf',
            borderRadius: '8px', px: 2, py: '10px',
            fontWeight: 600, fontSize: '1rem', textTransform: 'none',
            gap: 1, minWidth: 120,
            '&:hover': { bgcolor: '#f5f5f5', borderColor: '#aaa' },
          }}
        >
          Back
        </Button>

        {/* Skip */}
        <Button
          variant="outlined"
          onClick={handleSkip}
          endIcon={<KeyboardDoubleArrowRightIcon sx={{ fontSize: 20, color: '#1A2332' }} />}
          sx={{
            bgcolor: '#fff', color: '#1A2332', borderColor: '#cfcfcf',
            borderRadius: '8px', px: 2, py: '10px',
            fontWeight: 600, fontSize: '1rem', textTransform: 'none',
            gap: 1, minWidth: 120,
            '&:hover': { bgcolor: '#f5f5f5', borderColor: '#aaa' },
          }}
        >
          Skip
        </Button>

        {/* Next */}
        <Button
          variant="contained"
          disabled={!hasSelection}
          onClick={handleNext}
          endIcon={
            <Box sx={{
              width: 32, height: 32, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ArrowForwardIcon sx={{ fontSize: 16, color: hasSelection ? '#00a99d' : '#bfbfbf' }} />
            </Box>
          }
          sx={{
            bgcolor: hasSelection ? '#00a99d' : '#bfbfbf',
            '&:hover': { bgcolor: hasSelection ? '#00897b' : '#bfbfbf' },
            '&.Mui-disabled': { bgcolor: '#bfbfbf', color: '#fff' },
            borderRadius: '8px', px: 2, py: '10px',
            fontWeight: 600, fontSize: '1rem', textTransform: 'none',
            gap: 1, minWidth: 120,
          }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}
