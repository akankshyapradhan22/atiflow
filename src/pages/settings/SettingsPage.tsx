import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import PageHeader from '../../components/common/PageHeader';
import { mockConnections, defaultGeneralSettings } from '../../data/mock';
import type { ServiceConnection, GeneralSettings } from '../../types';
import { PRIMARY } from '../../theme';

// ── Connection Card ────────────────────────────────────────────────────────────
function ConnectionCard({ conn, onEdit, onDisconnect }: {
  conn: ServiceConnection;
  onEdit: (c: ServiceConnection) => void;
  onDisconnect: (id: string) => void;
}) {
  const connected = conn.status === 'connected';
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: '12px',
        borderLeftWidth: '3px',
        borderLeftColor: connected ? PRIMARY : '#e0e0e0',
        borderLeftStyle: 'solid',
        borderColor: connected ? PRIMARY : '#e0e0e0',
        transition: 'box-shadow 0.15s',
        '&:hover': { boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
      }}
    >
      <CardContent sx={{ pb: '16px !important', pt: 2, px: 2 }}>
        {/* Header row: avatar + name + icons */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Avatar sx={{ bgcolor: conn.color, width: 40, height: 40, fontSize: '0.8rem', fontWeight: 700 }}>
              {conn.abbreviation}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1a2332', lineHeight: '21.98px' }}>
                {conn.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {connected
                  ? <CheckCircleIcon sx={{ fontSize: 12, color: '#2e7d32' }} />
                  : <RadioButtonUncheckedIcon sx={{ fontSize: 12, color: '#e53935' }} />}
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: connected ? '#2e7d32' : '#e53935', lineHeight: '19.92px' }}>
                  {connected ? 'Connected' : 'Not Connected'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex' }}>
            <IconButton size="small" onClick={() => onEdit(conn)} sx={{ width: 26, height: 26 }}>
              <EditOutlinedIcon sx={{ fontSize: 16, color: '#637381' }} />
            </IconButton>
            {connected && (
              <IconButton size="small" onClick={() => onDisconnect(conn.id)} sx={{ width: 26, height: 26 }}>
                <DeleteOutlineIcon sx={{ fontSize: 16, color: '#637381' }} />
              </IconButton>
            )}
          </Box>
        </Box>

        {/* Divider + details only for connected */}
        {connected && (
          <>
            <Divider sx={{ borderColor: '#e8ecef', mb: 1.5 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#637381' }}>Host</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#637381', fontWeight: 500 }}>{conn.host}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#637381' }}>Port</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#637381', fontWeight: 500 }}>{conn.port}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '0.75rem', color: '#637381' }}>Last synced</Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#637381', fontWeight: 500 }}>{conn.lastSynced}</Typography>
              </Box>
            </Box>
          </>
        )}

        {/* Connect button for disconnected */}
        {!connected && (
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={() => onEdit(conn)}
            sx={{
              mt: 1.5,
              bgcolor: PRIMARY,
              color: '#fff',
              borderRadius: '4px',
              height: 30,
              textTransform: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              letterSpacing: '0.26px',
              '&:hover': { bgcolor: '#009188' },
            }}
          >
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
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '10px' } }}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332' }}>
        Configure {conn.name}
      </DialogTitle>
      <DialogContent sx={{ pt: '12px !important', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          label="Host / IP Address"
          size="small"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          InputProps={{ sx: { borderRadius: '6px' } }}
        />
        <TextField
          label="Port"
          size="small"
          type="number"
          value={port}
          onChange={(e) => setPort(e.target.value)}
          InputProps={{ sx: { borderRadius: '6px' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} color="inherit" sx={{ textTransform: 'none' }}>Cancel</Button>
        <Button
          variant="contained"
          disableElevation
          disabled={!host || !port}
          onClick={() => onSave({ ...conn, status: 'connected', host, port: Number(port), lastSynced: 'just now' })}
          sx={{ bgcolor: PRIMARY, textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#009188' } }}
        >
          Save & Connect
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ── Shared tab styling ────────────────────────────────────────────────────────
const tabSx = {
  px: 3,
  minHeight: 44,
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
    minHeight: 44,
    py: 0,
    color: '#637381',
    '&.Mui-selected': { color: PRIMARY, fontWeight: 600 },
  },
  '& .MuiTabs-indicator': { bgcolor: PRIMARY },
};

// ── Main Component ─────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [tabIdx, setTabIdx] = useState(0);
  const [connections, setConnections] = useState<ServiceConnection[]>(mockConnections);
  const [editConn, setEditConn] = useState<ServiceConnection | null>(null);
  const [settings, setSettings] = useState<GeneralSettings>(defaultGeneralSettings);
  const [search, setSearch] = useState('');

  const updateSetting = <
    K extends keyof GeneralSettings,
    F extends keyof GeneralSettings[K]
  >(section: K, field: F, val: boolean) => {
    setSettings((p) => ({ ...p, [section]: { ...p[section], [field]: val } }));
  };

  const handleSaveConn = (updated: ServiceConnection) => {
    setConnections((p) => p.map((c) => c.id === updated.id ? updated : c));
    setEditConn(null);
  };

  const handleDisconnect = (id: string) => {
    setConnections((p) => p.map((c) =>
      c.id === id ? { ...c, status: 'disconnected' as const, host: undefined, port: undefined, lastSynced: undefined } : c
    ));
  };

  const filteredConns = connections.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      <PageHeader title="Settings" />

      {/* Sub-tabs */}
      <Box sx={{ borderBottom: '1px solid #e8ecef', bgcolor: '#fff', flexShrink: 0 }}>
        <Tabs value={tabIdx} onChange={(_, v) => setTabIdx(v)} sx={tabSx}>
          <Tab label="Connections" disableRipple />
          <Tab label="General" disableRipple />
        </Tabs>
      </Box>

      {/* ── Connections ──────────────────────────────────────────────────── */}
      {tabIdx === 0 && (
        <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2.5, bgcolor: 'background.default' }}>
          {/* Toolbar: search + ADD NEW */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2.5 }}>
            <OutlinedInput
              size="small"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 16, color: '#9ea8b3' }} />
                </InputAdornment>
              }
              sx={{
                width: 280,
                height: 34,
                borderRadius: '8px',
                fontSize: '0.875rem',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#dde1e6' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: PRIMARY },
              }}
            />
            <Button
              variant="contained"
              disableElevation
              startIcon={<AddIcon sx={{ fontSize: 16 }} />}
              sx={{
                bgcolor: PRIMARY,
                color: '#fff',
                borderRadius: '6px',
                height: 44,
                px: 2,
                textTransform: 'none',
                fontSize: '0.8125rem',
                fontWeight: 600,
                letterSpacing: '0.26px',
                '&:hover': { bgcolor: '#009188' },
              }}
            >
              ADD NEW
            </Button>
          </Box>

          {/* Cards grid */}
          <Box sx={{ border: '1px solid #e8ecef', borderRadius: '9px', bgcolor: '#fff', p: 2.5 }}>
            <Grid container spacing={2}>
              {filteredConns.map((c) => (
                <Grid item xs={12} sm={6} md={4} key={c.id}>
                  <ConnectionCard conn={c} onEdit={setEditConn} onDisconnect={handleDisconnect} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}

      {/* ── General ──────────────────────────────────────────────────────── */}
      {tabIdx === 1 && (
        <Box sx={{ flex: 1, overflow: 'auto', px: 3, py: 2.5, bgcolor: 'background.default' }}>
          <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '10px', bgcolor: '#fff', p: 3 }}>

            {/* Material Configuration */}
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332', mb: 2.5 }}>
              Material Configuration
            </Typography>
            <Box sx={{ display: 'flex', gap: 6, mb: 0.5 }}>
              {/* SKU Breakdown */}
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#637381', mb: 1 }}>
                  SKU Breakdown
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox size="small" checked disabled sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }} />}
                    label={<Typography sx={{ fontSize: '0.8125rem', color: 'rgba(0,0,0,0.38)' }}>SKU</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={settings.skuBreakdown.subSku}
                        onChange={(e) => updateSetting('skuBreakdown', 'subSku', e.target.checked)}
                        sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#1a2332' }}>Sub-SKU</Typography>}
                  />
                </FormGroup>
              </Box>

              {/* Link Container */}
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#637381', mb: 1 }}>
                  Link Container
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={settings.linkContainer.containerType}
                        onChange={(e) => updateSetting('linkContainer', 'containerType', e.target.checked)}
                        sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#1a2332' }}>Container Type</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={settings.linkContainer.containerSubtype}
                        onChange={(e) => updateSetting('linkContainer', 'containerSubtype', e.target.checked)}
                        sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#1a2332' }}>Container Subtype</Typography>}
                  />
                </FormGroup>
              </Box>

              {/* Link Station */}
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#637381', mb: 1 }}>
                  Link Station
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={settings.linkStation.stationIdName}
                        onChange={(e) => updateSetting('linkStation', 'stationIdName', e.target.checked)}
                        sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#1a2332' }}>Station ID/Name</Typography>}
                  />
                </FormGroup>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#e8ecef', my: 3 }} />

            {/* Container Configuration */}
            <Typography sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332', mb: 2.5 }}>
              Container Configuration
            </Typography>
            <Box sx={{ display: 'flex', gap: 6 }}>
              {/* Container Type */}
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#637381', mb: 1 }}>
                  Container Type
                </Typography>
                <FormGroup>
                  {(['trolley', 'pallet', 'bin'] as const).map((key) => (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          size="small"
                          checked={settings.containerTypes[key]}
                          onChange={(e) => updateSetting('containerTypes', key, e.target.checked)}
                          sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }}
                        />
                      }
                      label={
                        <Typography sx={{ fontSize: '0.8125rem', color: '#1a2332', textTransform: 'capitalize' }}>
                          {key}
                        </Typography>
                      }
                    />
                  ))}
                </FormGroup>
              </Box>

              {/* Container Settings */}
              <Box>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: '#637381', mb: 1 }}>
                  Container Settings
                </Typography>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox size="small" checked disabled sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }} />}
                    label={<Typography sx={{ fontSize: '0.8125rem', color: 'rgba(0,0,0,0.38)' }}>Container Type</Typography>}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={settings.containerSettings.containerSubtype}
                        onChange={(e) => updateSetting('containerSettings', 'containerSubtype', e.target.checked)}
                        sx={{ color: PRIMARY, '&.Mui-checked': { color: PRIMARY } }}
                      />
                    }
                    label={<Typography sx={{ fontSize: '0.8125rem', color: '#1a2332' }}>Container Subtype</Typography>}
                  />
                </FormGroup>
              </Box>
            </Box>

            <Divider sx={{ borderColor: '#e8ecef', mt: 3 }} />
          </Box>
        </Box>
      )}

      {/* Edit / Connect dialog */}
      {editConn && (
        <EditConnectionDialog conn={editConn} onClose={() => setEditConn(null)} onSave={handleSaveConn} />
      )}
    </Box>
  );
}
