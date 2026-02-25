import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useWorkflowStore } from '../../stores/workflowStore';

const containerTypeName = (type: string) => type.charAt(0).toUpperCase() + type.slice(1);

// ─── Section header ────────────────────────────────────────────────────────────

function SectionHeader({
  icon: Icon,
  title,
  count,
  color = '#1A2332',
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  color?: string;
}) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
      <Box sx={{
        width: 30, height: 30, borderRadius: '8px', flexShrink: 0,
        bgcolor: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon sx={{ fontSize: 17, color }} />
      </Box>
      <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1A2332' }}>
        {title}
      </Typography>
      {count !== undefined && (
        <Box sx={{
          height: 20, px: '7px', display: 'flex', alignItems: 'center',
          bgcolor: `${color}18`, borderRadius: '10px',
        }}>
          <Typography sx={{ fontSize: '0.6875rem', fontWeight: 600, color }}>
            {count} {count === 1 ? 'item' : 'items'}
          </Typography>
        </Box>
      )}
    </Box>
  );
}

// ─── Material item card ────────────────────────────────────────────────────────

function MaterialCard({ skuName, subSkuTypeName, quantity }: {
  skuName: string;
  subSkuTypeName: string;
  quantity: number;
}) {
  return (
    <Box sx={{
      display: 'flex',
      border: '1px solid #e8e8e8',
      borderRadius: '10px',
      overflow: 'hidden',
      bgcolor: '#fff',
    }}>
      {/* Teal left accent */}
      <Box sx={{ width: 4, flexShrink: 0, bgcolor: '#00a99d' }} />

      {/* Info */}
      <Box sx={{ flex: 1, px: 2, py: 1.5 }}>
        <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem', color: '#1A2332', lineHeight: 1.3 }}>
          {skuName}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(26,35,50,0.45)' }}>Sub-SKU</Typography>
          <Typography sx={{
            fontSize: '0.75rem', fontWeight: 500, color: 'rgba(26,35,50,0.75)',
            fontFamily: '"IBM Plex Mono", monospace',
          }}>
            {subSkuTypeName}
          </Typography>
        </Box>
      </Box>

      {/* Quantity */}
      <Box sx={{
        flexShrink: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        px: 2.5, borderLeft: '1px solid #f0f0f0',
        bgcolor: 'rgba(0,169,157,0.04)',
      }}>
        <Typography sx={{
          fontFamily: '"IBM Plex Mono", monospace',
          fontWeight: 700, fontSize: '1.375rem', color: '#1A2332', lineHeight: 1,
        }}>
          {quantity}
        </Typography>
        <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(26,35,50,0.45)', mt: 0.25 }}>
          units
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Container item card ───────────────────────────────────────────────────────

function ContainerCard({ containerType, subtypeName }: {
  containerType: string;
  subtypeName: string;
}) {
  return (
    <Box sx={{
      display: 'flex', alignItems: 'center',
      border: '1px solid #e8e8e8',
      borderRadius: '10px',
      overflow: 'hidden',
      bgcolor: '#fff',
    }}>
      {/* Amber left accent */}
      <Box sx={{ width: 4, flexShrink: 0, bgcolor: '#ffa719' }} />

      <Box sx={{ flex: 1, px: 2, py: 1.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {/* Type label */}
        <Box sx={{
          px: 1.25, py: '4px', borderRadius: '6px',
          bgcolor: 'rgba(255,167,25,0.1)', border: '1px solid rgba(255,167,25,0.4)',
          flexShrink: 0,
        }}>
          <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#1A2332' }}>
            {containerTypeName(containerType)}
          </Typography>
        </Box>

        <ChevronRightIcon sx={{ fontSize: 16, color: '#BDBDBD', flexShrink: 0 }} />

        <Typography sx={{ fontWeight: 500, fontSize: '0.875rem', color: '#1A2332' }}>
          {subtypeName}
        </Typography>
      </Box>
    </Box>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const cart = useCartStore((s) => s.cart);
  const containerCart = useCartStore((s) => s.containerCart);
  const clearAll = useCartStore((s) => s.clearAll);
  const activeWorkflow = useWorkflowStore((s) => s.activeWorkflow);

  const [submitted, setSubmitted] = useState(false);

  const totalUnits = cart.reduce((sum, i) => sum + i.quantity, 0);

  /* ── Success screen ── */
  if (submitted) {
    return (
      <Box sx={{
        display: 'flex', flexDirection: 'column', height: '100%',
        alignItems: 'center', justifyContent: 'center', gap: 3, px: 4,
      }}>
        <Box sx={{
          width: 76, height: 76, borderRadius: '50%',
          bgcolor: 'rgba(0,169,157,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CheckCircleIcon sx={{ fontSize: 42, color: '#00a99d' }} />
        </Box>
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1A2332', mb: 0.75 }}>
            Request Submitted!
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'rgba(26,35,50,0.55)', lineHeight: 1.7, maxWidth: 280 }}>
            Your material request has been placed and will be fulfilled shortly.
          </Typography>
        </Box>

        {/* Summary pills */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Box sx={{ px: 1.5, py: '5px', bgcolor: 'rgba(0,169,157,0.1)', border: '1px solid rgba(0,169,157,0.3)', borderRadius: '20px' }}>
            <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1A2332' }}>
              {cart.length} material{cart.length !== 1 ? 's' : ''} · {totalUnits} units
            </Typography>
          </Box>
          {containerCart.length > 0 && (
            <Box sx={{ px: 1.5, py: '5px', bgcolor: 'rgba(255,167,25,0.1)', border: '1px solid rgba(255,167,25,0.35)', borderRadius: '20px' }}>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1A2332' }}>
                {containerCart.length} container{containerCart.length !== 1 ? 's' : ''}
              </Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/history')}
            sx={{
              borderRadius: '8px', px: 2.5, py: '10px', fontWeight: 600,
              textTransform: 'none', borderColor: '#cfcfcf', color: '#1A2332',
              '&:hover': { bgcolor: '#f5f5f5', borderColor: '#aaa' },
            }}
          >
            View Requests
          </Button>
          <Button
            variant="contained"
            onClick={() => { clearAll(); navigate('/history'); }}
            sx={{
              bgcolor: '#00a99d', '&:hover': { bgcolor: '#00897b' },
              borderRadius: '8px', px: 2.5, py: '10px', fontWeight: 600, textTransform: 'none',
            }}
          >
            Back to Home
          </Button>
        </Box>
      </Box>
    );
  }

  /* ── Empty guard ── */
  if (cart.length === 0) {
    return (
      <Box sx={{
        display: 'flex', flexDirection: 'column', height: '100%',
        alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <Typography sx={{ color: 'rgba(26,35,50,0.55)', fontSize: '0.875rem' }}>
          Nothing to confirm. Add materials first.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/history/create')}
          sx={{ bgcolor: '#00a99d', '&:hover': { bgcolor: '#00897b' }, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}
        >
          Add Materials
        </Button>
      </Box>
    );
  }

  /* ── Main summary view ── */
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
          Order Summary
        </Typography>
        <Divider />
      </Box>

      {/* Scrollable content */}
      <Box sx={{ flex: 1, overflow: 'auto', scrollbarGutter: 'stable', px: 3, pt: 2, pb: 1.5, minHeight: 0, display: 'flex', flexDirection: 'column', gap: 2.5 }}>

        {/* Workflow info */}
        {activeWorkflow && (
          <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            p: 1.5, borderRadius: '10px',
            bgcolor: 'rgba(0,169,157,0.05)', border: '1px solid rgba(0,169,157,0.2)',
          }}>
            <AccountTreeOutlinedIcon sx={{ fontSize: 18, color: '#00a99d', flexShrink: 0 }} />
            <Box>
              <Typography sx={{ fontSize: '0.6875rem', color: 'rgba(26,35,50,0.45)', fontWeight: 500, mb: '1px' }}>
                Workflow
              </Typography>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A2332' }}>
                {activeWorkflow.name}
              </Typography>
            </Box>
          </Box>
        )}

        {/* Materials */}
        <Box>
          <SectionHeader
            icon={InventoryOutlinedIcon}
            title="Materials"
            count={cart.length}
            color="#00a99d"
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.875 }}>
            {cart.map((item, idx) => (
              <MaterialCard
                key={idx}
                skuName={item.skuName}
                subSkuTypeName={item.subSkuTypeName}
                quantity={item.quantity}
              />
            ))}
          </Box>
        </Box>

        {/* Containers */}
        {containerCart.length > 0 && (
          <Box>
            <SectionHeader
              icon={Inventory2OutlinedIcon}
              title="Containers"
              count={containerCart.length}
              color="#ffa719"
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.875 }}>
              {containerCart.map((item, idx) => (
                <ContainerCard
                  key={idx}
                  containerType={item.containerType}
                  subtypeName={item.subtypeName}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Totals summary box */}
        <Box sx={{
          borderRadius: '10px',
          border: '1px solid #ebebeb',
          bgcolor: '#fafafa',
          overflow: 'hidden',
        }}>
          <Box sx={{ px: 2, py: 1.25, bgcolor: '#f4f4f4', borderBottom: '1px solid #ebebeb' }}>
            <Typography sx={{ fontWeight: 600, fontSize: '0.8125rem', color: '#1A2332' }}>
              Summary
            </Typography>
          </Box>
          <Box sx={{ px: 2, py: 1.25, display: 'flex', flexDirection: 'column', gap: 0.875 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(26,35,50,0.55)' }}>Material types</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace' }}>
                {cart.length}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(26,35,50,0.55)' }}>Total units</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace' }}>
                {totalUnits}
              </Typography>
            </Box>
            {containerCart.length > 0 && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(26,35,50,0.55)' }}>Containers</Typography>
                <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1A2332', fontFamily: '"IBM Plex Mono", monospace' }}>
                  {containerCart.length}
                </Typography>
              </Box>
            )}
            <Divider sx={{ borderColor: '#ebebeb' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography sx={{ fontSize: '0.8125rem', color: 'rgba(26,35,50,0.55)' }}>Workflow</Typography>
              <Typography sx={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1A2332' }}>
                {activeWorkflow?.name ?? '—'}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Footer */}
      <Divider />
      <Box sx={{
        px: 3, py: 1.5,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        bgcolor: '#fff', flexShrink: 0,
      }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/history/container')}
          startIcon={
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%',
              bgcolor: 'rgba(26,35,50,0.04)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <ArrowForwardIcon sx={{ fontSize: 15, color: '#1A2332', transform: 'rotate(180deg)' }} />
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

        <Button
          variant="contained"
          onClick={() => setSubmitted(true)}
          endIcon={
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <CheckCircleIcon sx={{ fontSize: 15, color: '#00a99d' }} />
            </Box>
          }
          sx={{
            bgcolor: '#00a99d', '&:hover': { bgcolor: '#00897b' },
            borderRadius: '8px', px: 2.5, py: '10px',
            fontWeight: 600, fontSize: '1rem', textTransform: 'none',
            gap: 1, minWidth: 190,
          }}
        >
          Confirm Request
        </Button>
      </Box>
    </Box>
  );
}
