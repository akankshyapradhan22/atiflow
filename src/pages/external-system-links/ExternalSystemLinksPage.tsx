import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import SyncIcon from '@mui/icons-material/Sync';
import PageHeader from '../../components/common/PageHeader';
import { mockConnections } from '../../data/mock';
import type { ServiceConnection } from '../../types';
import { PRIMARY } from '../../theme';

// ── Connection Detail Row ─────────────────────────────────────────────────────
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>{label}</Typography>
      <Typography variant="caption" sx={{ fontWeight: 500, fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem' }}>
        {value}
      </Typography>
    </Box>
  );
}

// ── Connection Card ────────────────────────────────────────────────────────────
function ConnectionCard({
  conn, onEdit, onDisconnect, onSync,
}: {
  conn: ServiceConnection;
  onEdit: (c: ServiceConnection) => void;
  onDisconnect: (id: string) => void;
  onSync: (id: string) => void;
}) {
  const connected = conn.status === 'connected';
  return (
    <Card variant="outlined" sx={{
      borderRadius: '13px',
      borderLeftWidth: 4,
      borderLeftColor: connected ? PRIMARY : '#E0E0E0',
      borderLeftStyle: 'solid',
      transition: 'box-shadow 0.15s',
      '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
    }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: conn.color, width: 44, height: 44, fontSize: '0.8rem', fontWeight: 700, borderRadius: '10px' }}>
              {conn.abbreviation}
            </Avatar>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.3 }}>{conn.name}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
                {connected
                  ? <CheckCircleOutlineIcon sx={{ fontSize: 12, color: '#2E7D32' }} />
                  : <RadioButtonUncheckedIcon sx={{ fontSize: 12, color: '#E53935' }} />}
                <Typography variant="caption" sx={{ color: connected ? '#2E7D32' : '#E53935', fontWeight: 600 }}>
                  {connected ? 'Connected' : 'Not Connected'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.25 }}>
            {connected && (
              <Tooltip title="Sync now">
                <IconButton size="small" onClick={() => onSync(conn.id)}>
                  <SyncIcon sx={{ fontSize: 16, color: '#637381' }} />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title="Edit configuration">
              <IconButton size="small" onClick={() => onEdit(conn)}>
                <EditOutlinedIcon sx={{ fontSize: 16, color: '#637381' }} />
              </IconButton>
            </Tooltip>
            {connected && (
              <Tooltip title="Disconnect">
                <IconButton size="small" onClick={() => onDisconnect(conn.id)}>
                  <LinkOffIcon sx={{ fontSize: 16, color: '#E53935' }} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>

        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5, lineHeight: 1.4 }}>
          {conn.description}
        </Typography>

        {connected && (
          <>
            <Divider sx={{ mb: 1.5 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <DetailRow label="Host / IP" value={conn.host ?? '—'} />
              <DetailRow label="Port" value={String(conn.port ?? '—')} />
              <DetailRow label="Last synced" value={conn.lastSynced ?? '—'} />
            </Box>
          </>
        )}

        {!connected && (
          <Button variant="contained" fullWidth size="small" sx={{ mt: 0.5 }} onClick={() => onEdit(conn)}>
            Connect
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// ── Edit / Connect Dialog ──────────────────────────────────────────────────────
function EditConnectionDialog({ conn, onClose, onSave }: {
  conn: ServiceConnection;
  onClose: () => void;
  onSave: (updated: ServiceConnection) => void;
}) {
  const [host, setHost] = useState(conn.host ?? '');
  const [port, setPort] = useState(String(conn.port ?? ''));
  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 600 }}>
        {conn.status === 'connected' ? `Edit — ${conn.name}` : `Connect — ${conn.name}`}
      </DialogTitle>
      <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField label="Host / IP Address" size="small" fullWidth value={host}
          onChange={(e) => setHost(e.target.value)} placeholder="e.g. fm.atimotors.com" />
        <TextField label="Port" size="small" type="number" fullWidth value={port}
          onChange={(e) => setPort(e.target.value)} placeholder="e.g. 8443" />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button variant="contained" disabled={!host || !port}
          onClick={() => onSave({ ...conn, status: 'connected', host, port: Number(port), lastSynced: 'just now' })}>
          Save & Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ExternalSystemLinksPage() {
  const [connections, setConnections] = useState<ServiceConnection[]>(mockConnections);
  const [editConn, setEditConn] = useState<ServiceConnection | null>(null);

  const handleSave = (updated: ServiceConnection) => {
    setConnections((p) => p.map((c) => c.id === updated.id ? updated : c));
    setEditConn(null);
  };

  const handleDisconnect = (id: string) => {
    setConnections((p) =>
      p.map((c) => c.id === id
        ? { ...c, status: 'disconnected' as const, host: undefined, port: undefined, lastSynced: undefined }
        : c),
    );
  };

  const handleSync = (id: string) => {
    setConnections((p) => p.map((c) => c.id === id ? { ...c, lastSynced: 'just now' } : c));
  };

  const connected = connections.filter((c) => c.status === 'connected');
  const disconnected = connections.filter((c) => c.status === 'disconnected');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <PageHeader title="External System Links" />

      <Box sx={{ px: 3, pt: 2.5, pb: 3, flexGrow: 1, overflow: 'auto', minHeight: 0, bgcolor: 'background.default' }}>
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
          <Chip label={`${connected.length} Connected`} size="small"
            sx={{ backgroundColor: '#E8F5E9', color: '#2E7D32', fontWeight: 600, fontSize: '0.75rem' }} />
          {disconnected.length > 0 && (
            <Chip label={`${disconnected.length} Not Connected`} size="small"
              sx={{ backgroundColor: '#FFEBEE', color: '#C62828', fontWeight: 600, fontSize: '0.75rem' }} />
          )}
        </Box>

        {connected.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1.5 }}>
              Active Connections
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
              {connected.map((c) => (
                <ConnectionCard key={c.id} conn={c} onEdit={setEditConn} onDisconnect={handleDisconnect} onSync={handleSync} />
              ))}
            </Box>
          </Box>
        )}

        {disconnected.length > 0 && (
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', mb: 1.5 }}>
              Available Integrations
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
              {disconnected.map((c) => (
                <ConnectionCard key={c.id} conn={c} onEdit={setEditConn} onDisconnect={handleDisconnect} onSync={handleSync} />
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {editConn && (
        <EditConnectionDialog conn={editConn} onClose={() => setEditConn(null)} onSave={handleSave} />
      )}
    </Box>
  );
}
