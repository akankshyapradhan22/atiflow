import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ViewListIcon from '@mui/icons-material/ViewList';
import { mockMaterials } from '../../data/mock';
import { useCartStore } from '../../stores/cartStore';
import type { SubSKUType, CartItem } from '../../types';
import { PRIMARY } from '../../theme';

type ViewMode = 'grid' | 'list';

type FlatSST = SubSKUType & { skuName: string; skuCode: string };

export default function MaterialSelectionPage() {
  const navigate = useNavigate();
  const cart = useCartStore((s) => s.cart);
  const addToCart = useCartStore((s) => s.addToCart);
  const removeFromCart = useCartStore((s) => s.removeFromCart);
  const [search, setSearch] = useState('');
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const allSubSkus: FlatSST[] = mockMaterials.flatMap((sku) =>
    sku.subSkuTypes.map((sst) => ({ ...sst, skuName: sku.name, skuCode: sku.code }))
  );

  const filtered = allSubSkus.filter((s) => {
    const q = search.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.skuName.toLowerCase().includes(q);
  });

  const getQty = (id: string) => quantities[id] ?? 1;

  const setQty = (id: string, delta: number, max: number) =>
    setQuantities((prev) => {
      const next = Math.max(1, Math.min(max, (prev[id] ?? 1) + delta));
      return { ...prev, [id]: next };
    });

  // Blocked = unavailable (available === 0) OR still in pre-processing
  const isBlocked = (sst: SubSKUType) => sst.available === 0 || sst.inPreProcessing;

  const inCart = (id: string) => cart.some((i) => i.subSkuTypeId === id);

  const handleAdd = (sst: FlatSST) => {
    const item: CartItem = {
      subSkuTypeId: sst.id,
      subSkuTypeName: `${sst.skuName} – ${sst.name}`,
      skuName: sst.skuName,
      quantity: getQty(sst.id),
      maxQty: sst.maxQty,
    };
    addToCart(item);
  };

  const StatusChip = ({ sst }: { sst: SubSKUType }) => {
    if (sst.inPreProcessing)
      return <Chip label="Pre-Processing" size="small" sx={{ fontSize: '0.7rem', bgcolor: 'rgba(245,124,0,0.08)', color: '#E65100', fontWeight: 600 }} />;
    if (sst.available === 0)
      return <Chip label="Unavailable" size="small" sx={{ fontSize: '0.7rem', bgcolor: '#F5F5F5', color: '#9E9E9E' }} />;
    return <Chip label={`${sst.available} avail.`} size="small" sx={{ fontSize: '0.7rem', bgcolor: 'rgba(0,150,136,0.08)', color: PRIMARY, fontWeight: 600 }} />;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>

      {/* Sub-header */}
      <Box sx={{ px: 2.5, py: 1.25, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', display: 'flex', alignItems: 'center', gap: 1.5, flexShrink: 0 }}>
        <IconButton size="small" onClick={() => navigate(-1)} sx={{ color: 'text.secondary' }}>
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>Order Material</Typography>
          <Typography variant="caption" color="text.secondary">Select Sub-SKU types and quantities</Typography>
        </Box>

        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, v) => v && setViewMode(v)}
          size="small"
          sx={{
            '& .MuiToggleButton-root': {
              border: '1px solid', borderColor: 'divider', px: 1, py: 0.5,
              '&.Mui-selected': { bgcolor: 'rgba(0,150,136,0.08)', color: PRIMARY, borderColor: PRIMARY },
            },
          }}
        >
          <ToggleButton value="grid"><Tooltip title="Grid view"><ViewModuleIcon sx={{ fontSize: 18 }} /></Tooltip></ToggleButton>
          <ToggleButton value="list"><Tooltip title="List view"><ViewListIcon sx={{ fontSize: 18 }} /></Tooltip></ToggleButton>
        </ToggleButtonGroup>

        {cart.length > 0 && (
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCartOutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={() => navigate('/requester/checkout')}
            sx={{ borderRadius: 2, px: 2, fontWeight: 700 }}
          >
            Checkout ({cart.length})
          </Button>
        )}
      </Box>

      {/* Search */}
      <Box sx={{ px: 2.5, py: 1.25, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <OutlinedInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by material name or code…"
          fullWidth size="small"
          startAdornment={<InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} /></InputAdornment>}
          sx={{ bgcolor: '#f7f7f7', '& input': { py: '9px' } }}
        />
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minHeight: 0, overflow: 'auto', scrollbarGutter: 'stable', px: 2.5, py: 2 }}>
        {filtered.length === 0 && (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography color="text.secondary" variant="body2">No materials match your search</Typography>
          </Box>
        )}

        {/* ── GRID VIEW ── */}
        {viewMode === 'grid' && (
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1.5 }}>
            {filtered.map((sst) => {
              const blocked = isBlocked(sst);
              const qty = getQty(sst.id);
              const added = inCart(sst.id);

              return (
                <Paper
                  key={sst.id}
                  variant="outlined"
                  sx={{
                    p: 2, borderRadius: 1.5,
                    borderColor: added ? PRIMARY : blocked ? '#e0e0e0' : 'divider',
                    bgcolor: added ? 'rgba(0,150,136,0.04)' : blocked ? '#fafafa' : 'background.paper',
                    opacity: blocked ? 0.6 : 1,
                    transition: 'border-color 0.15s',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', mb: 0.25 }}>{sst.skuName}</Typography>
                      <Typography sx={{ fontWeight: 500, fontSize: '0.8125rem', color: PRIMARY }}>{sst.name}</Typography>
                      <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace' }}>{sst.code}</Typography>
                    </Box>
                    <StatusChip sst={sst} />
                  </Box>

                  <Divider sx={{ mb: 1.5 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, border: '1px solid', borderColor: 'divider', borderRadius: 1.5, overflow: 'hidden' }}>
                      <IconButton size="small" disabled={blocked || qty <= 1} onClick={() => setQty(sst.id, -1, sst.maxQty)} sx={{ borderRadius: 0, width: 36, height: 36 }}>
                        <RemoveIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                      <Typography sx={{ minWidth: 28, textAlign: 'center', fontWeight: 700, fontSize: '1rem', color: blocked ? 'text.disabled' : 'text.primary' }}>
                        {qty}
                      </Typography>
                      <IconButton size="small" disabled={blocked || qty >= sst.maxQty} onClick={() => setQty(sst.id, +1, sst.maxQty)} sx={{ borderRadius: 0, width: 36, height: 36 }}>
                        <AddIcon sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Box>
                    <Typography variant="caption" color="text.disabled" sx={{ flex: 1 }}>max {sst.maxQty}</Typography>
                    {added ? (
                      <Tooltip title="Remove from cart">
                        <Button size="small" variant="outlined" color="error" onClick={() => removeFromCart(sst.id)} startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 16 }} />} sx={{ fontSize: '0.75rem', borderRadius: 1.5, px: 1.5, minHeight: 36 }}>
                          Added
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button size="small" variant="contained" disabled={blocked} onClick={() => handleAdd(sst)} startIcon={<AddIcon sx={{ fontSize: 16 }} />} sx={{ fontSize: '0.75rem', borderRadius: 1.5, px: 1.5, minHeight: 36 }}>
                        Add
                      </Button>
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Box>
        )}

        {/* ── LIST VIEW ── */}
        {viewMode === 'list' && (
          <Paper variant="outlined" sx={{ borderRadius: 1.5, overflow: 'hidden' }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 110px 80px 140px', px: 2, py: 1, bgcolor: '#f7f7f7', borderBottom: '1px solid', borderColor: 'divider' }}>
              {['Material', 'Status', 'Qty', ''].map((h) => (
                <Typography key={h} variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</Typography>
              ))}
            </Box>

            {filtered.map((sst, idx) => {
              const blocked = isBlocked(sst);
              const qty = getQty(sst.id);
              const added = inCart(sst.id);

              return (
                <Box key={sst.id}>
                  {idx > 0 && <Divider />}
                  <Box sx={{
                    display: 'grid', gridTemplateColumns: '1fr 110px 80px 140px',
                    px: 2, py: 1.25, alignItems: 'center',
                    bgcolor: added ? 'rgba(0,150,136,0.03)' : blocked ? '#fafafa' : 'background.paper',
                    opacity: blocked ? 0.6 : 1,
                  }}>
                    <Box sx={{ minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {sst.skuName}
                        </Typography>
                        {added && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: PRIMARY, flexShrink: 0 }} />}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.75rem', color: PRIMARY, fontWeight: 500 }}>{sst.name}</Typography>
                        <Typography variant="caption" sx={{ color: 'text.disabled', fontFamily: 'monospace', fontSize: '0.7rem' }}>{sst.code}</Typography>
                      </Box>
                    </Box>

                    <StatusChip sst={sst} />

                    <Box sx={{ display: 'flex', alignItems: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden', width: 'fit-content' }}>
                      <IconButton size="small" disabled={blocked || qty <= 1} onClick={() => setQty(sst.id, -1, sst.maxQty)} sx={{ borderRadius: 0, width: 28, height: 32 }}>
                        <RemoveIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                      <Typography sx={{ minWidth: 22, textAlign: 'center', fontWeight: 700, fontSize: '0.875rem', color: blocked ? 'text.disabled' : 'text.primary' }}>
                        {qty}
                      </Typography>
                      <IconButton size="small" disabled={blocked || qty >= sst.maxQty} onClick={() => setQty(sst.id, +1, sst.maxQty)} sx={{ borderRadius: 0, width: 28, height: 32 }}>
                        <AddIcon sx={{ fontSize: 13 }} />
                      </IconButton>
                    </Box>

                    {added ? (
                      <Button size="small" variant="outlined" color="error" onClick={() => removeFromCart(sst.id)} startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: '0.7rem', borderRadius: 1.5, px: 1.25, height: 32 }}>
                        Added
                      </Button>
                    ) : (
                      <Button size="small" variant="contained" disabled={blocked} onClick={() => handleAdd(sst)} startIcon={<AddIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: '0.7rem', borderRadius: 1.5, px: 1.25, height: 32 }}>
                        Add
                      </Button>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Paper>
        )}
      </Box>
    </Box>
  );
}
