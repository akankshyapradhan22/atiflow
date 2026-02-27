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
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { mockContainers } from '../../data/mock';

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

export default function ReturnTrolleyPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const cart = useCartStore((s) => s.cart);

  const [selectedContainerId, setSelectedContainerId] = useState('');
  const [selectedSubtypeId, setSelectedSubtypeId] = useState('');

  const selectedContainer = mockContainers.find(c => c.id === selectedContainerId);
  const hasSelection = !!selectedContainerId && !!selectedSubtypeId;

  const handleContainerChange = (containerId: string) => {
    setSelectedContainerId(containerId);
    setSelectedSubtypeId('');
  };

  const containerTypeName = (type: string) =>
    type.charAt(0).toUpperCase() + type.slice(1);

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
          Return Empty Container
        </Typography>
        <Divider />
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', px: 3, pt: 2, pb: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>

        {/* Container Type parent row */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.75, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          <LabelChip
            icon={GridViewOutlinedIcon}
            label="Container Type"
            selected={false}
            minWidth={160}
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
            sx={{ ...selectSx, width: { xs: '100%', md: 440 } }}
          >
            {mockContainers.map(c => (
              <MenuItem key={c.id} value={c.id} sx={{ fontSize: '0.875rem' }}>
                {containerTypeName(c.type)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Sub-type branch row */}
        <Box sx={{ display: 'flex', alignItems: 'stretch', minHeight: 66 }}>
          <BranchConnector isLast />

          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1.75, py: 1 }}>
            <LabelChip
              icon={ExtensionOutlinedIcon}
              label="Container Sub-type"
              selected={!!selectedSubtypeId}
              minWidth={180}
            />
            <Select
              value={selectedSubtypeId}
              onChange={e => setSelectedSubtypeId(e.target.value)}
              displayEmpty
              disabled={!selectedContainerId}
              size="small"
              renderValue={val => val
                ? selectedContainer?.subtypes.find(s => s.id === val)?.name
                : <Typography sx={{ color: 'rgba(26,35,50,0.43)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                    {selectedContainerId ? 'Select sub-type' : 'Please select container type first'}
                  </Typography>
              }
              sx={{ ...selectSx, flex: 1 }}
            >
              {(selectedContainer?.subtypes ?? []).map(s => (
                <MenuItem key={s.id} value={s.id} sx={{ fontSize: '0.875rem' }}>
                  {s.name} ({s.available} avail.)
                </MenuItem>
              ))}
            </Select>
          </Box>
        </Box>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Step-1 cart summary (read-only) */}
        {cart.length > 0 && (
          <Box sx={{ mb: 0.5 }}>
            {cart.map((item, idx) => (
              <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: '6px', mb: 0.75, flexWrap: 'wrap' }}>
                {/* SKU chip */}
                <Box sx={{
                  height: 30, px: '7px', display: 'flex', alignItems: 'center',
                  bgcolor: '#f2f2f2', border: '1px solid #c1c1c1', borderRadius: '6px', flexShrink: 0,
                }}>
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.75rem', color: 'rgba(26,35,50,0.74)' }}>
                    SKU
                  </Typography>
                </Box>
                <Box sx={{
                  height: 30, px: '10px', display: 'flex', alignItems: 'center',
                  bgcolor: '#fff', border: '1px solid #cacaca', borderRadius: '6px',
                }}>
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.75rem', color: '#1A2332' }}>
                    {item.skuName}
                  </Typography>
                </Box>

                <ArrowForwardIcon sx={{ fontSize: 14, color: '#BDBDBD' }} />

                {/* Sub-SKU chip */}
                <Box sx={{
                  height: 30, px: '7px', display: 'flex', alignItems: 'center',
                  bgcolor: 'rgba(0,169,157,0.14)', border: '1px solid #00a99d', borderRadius: '6px', flexShrink: 0,
                }}>
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.75rem', color: 'rgba(26,35,50,0.74)' }}>
                    Sub-SKU
                  </Typography>
                </Box>
                <Box sx={{
                  height: 30, px: '10px', display: 'flex', alignItems: 'center',
                  bgcolor: '#fff', border: '1px solid #cacaca', borderRadius: '6px',
                }}>
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.75rem', color: '#1A2332' }}>
                    {item.subSkuTypeName}
                  </Typography>
                </Box>

                <ArrowForwardIcon sx={{ fontSize: 14, color: '#BDBDBD' }} />

                {/* Qty + label */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <Typography sx={{ fontSize: '0.625rem', color: 'rgba(26,35,50,0.74)', fontWeight: 500, lineHeight: 1 }}>
                    Quantity
                  </Typography>
                  <Box sx={{
                    height: 30, px: '10px', display: 'flex', alignItems: 'center',
                    bgcolor: '#fff', border: '1px solid #cacaca', borderRadius: '6px',
                  }}>
                    <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.875rem', fontWeight: 700, color: '#1A2332' }}>
                      {item.quantity}
                    </Typography>
                  </Box>
                </Box>

                {/* Units chip */}
                <Box sx={{
                  height: 30, px: '7px', display: 'flex', alignItems: 'flex-end', pb: '1px',
                  bgcolor: '#f2f2f2', border: '1px solid #c1c1c1', borderRadius: '6px', flexShrink: 0,
                }}>
                  <Typography sx={{ fontFamily: '"IBM Plex Mono", monospace', fontSize: '0.75rem', color: 'rgba(26,35,50,0.74)' }}>
                    Units
                  </Typography>
                </Box>
              </Box>
            ))}
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
        {/* Back */}
        <Button
          variant="outlined"
          onClick={() => navigate('/history/create')}
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
          onClick={() => navigate('/history/container')}
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
          onClick={() => navigate('/history/container')}
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
