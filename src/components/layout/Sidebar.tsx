import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import TabletMacOutlinedIcon from '@mui/icons-material/TabletMacOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useProcessingAreas } from '../../context/ProcessingAreasContext';
import { PRIMARY } from '../../theme';

export const SIDEBAR_WIDTH = 220;

const NAV_ITEMS = [
  { label: 'Execution Source Config', path: '/execution-source', icon: <TabletMacOutlinedIcon sx={{ fontSize: 20 }} /> },
  { label: 'Settings',                path: '/settings',          icon: <SettingsOutlinedIcon sx={{ fontSize: 20 }} /> },
];

interface SidebarProps {
  onCreateArea?: () => void;
}

export default function Sidebar({ onCreateArea }: SidebarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { areas, renameArea, deleteArea } = useProcessingAreas();
  const [paOpen, setPaOpen] = useState(true);

  // Kebab menu state
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [menuAreaId, setMenuAreaId] = useState<string | null>(null);

  // Rename dialog state
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameName, setRenameName] = useState('');

  // Delete dialog state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const isActive     = (path: string)   => pathname === path || pathname.startsWith(path + '/');
  const isAreaActive = (areaId: string) => pathname === `/area/${areaId}` || pathname.startsWith(`/area/${areaId}/`);
  const isHomeActive = pathname === '/';

  const navItemSx = (active: boolean) => ({
    mx: 0.75,
    mb: 0.25,
    borderRadius: '5px',
    py: 0.875,
    px: 1.25,
    gap: 0.5,
    bgcolor: active ? 'rgba(0,169,157,0.19)' : 'transparent',
    '&:hover': { bgcolor: active ? 'rgba(0,169,157,0.19)' : 'rgba(0,0,0,0.04)' },
  });

  const handleKebabClick = (e: React.MouseEvent<HTMLElement>, areaId: string) => {
    e.stopPropagation();
    setMenuAreaId(areaId);
    setMenuAnchor(e.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setMenuAreaId(null);
  };

  const handleRenameOpen = () => {
    const area = areas.find((a) => a.id === menuAreaId);
    setRenameName(area?.name ?? '');
    setRenameOpen(true);
    handleMenuClose();
  };

  const handleRenameSave = () => {
    if (menuAreaId || renameOpen) {
      // menuAreaId was cleared on menu close, capture via renameName flow
    }
    setRenameOpen(false);
  };

  // Track which area is being renamed
  const [renameTargetId, setRenameTargetId] = useState<string | null>(null);

  const openRename = (areaId: string) => {
    const area = areas.find((a) => a.id === areaId);
    setRenameTargetId(areaId);
    setRenameName(area?.name ?? '');
    setRenameOpen(true);
    handleMenuClose();
  };

  const commitRename = () => {
    if (renameTargetId && renameName.trim()) {
      renameArea(renameTargetId, renameName.trim());
    }
    setRenameOpen(false);
    setRenameTargetId(null);
  };

  const openDelete = (areaId: string) => {
    setDeleteTargetId(areaId);
    setDeleteOpen(true);
    handleMenuClose();
  };

  const commitDelete = () => {
    if (deleteTargetId) {
      deleteArea(deleteTargetId);
      // Navigate away if currently on deleted area
      if (pathname.startsWith(`/area/${deleteTargetId}`)) navigate('/');
    }
    setDeleteOpen(false);
    setDeleteTargetId(null);
  };

  return (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        flexShrink: 0,
        height: '100%',
        bgcolor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* ── Logo ──────────────────────────────────────── */}
      <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#1A2332', letterSpacing: '-0.01em' }}>Ati</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#00a99d', letterSpacing: '-0.01em' }}> Flow</Typography>
          <Typography sx={{ fontSize: '0.5rem', color: '#8d8d8d', ml: 0.5, lineHeight: 1 }}>v2.0</Typography>
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#eeeeee' }} />

      {/* ── Top nav items ─────────────────────────────── */}
      <List disablePadding dense sx={{ pt: 0.75 }}>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.path);
          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              disableRipple
              sx={navItemSx(active)}
            >
              <ListItemIcon sx={{ minWidth: 30, color: active ? PRIMARY : '#637381' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: active ? 600 : 500,
                  color: active ? PRIMARY : '#1a2332',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ borderColor: '#eeeeee', my: 0.5 }} />

      {/* ── Processing Areas ───────────────────────────── */}
      <Box sx={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        <ListItemButton
          onClick={() => setPaOpen((o) => !o)}
          disableRipple
          sx={{ mx: 0.875, borderRadius: '6px', py: 0.75, px: 1.25, '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } }}
        >
          <ListItemText
            primary="Processing Areas"
            primaryTypographyProps={{ fontSize: '0.75rem', fontWeight: 600, color: '#1a2332', letterSpacing: '0.01em' }}
          />
          {paOpen
            ? <ExpandMoreIcon sx={{ fontSize: 16, color: '#637381' }} />
            : <ChevronRightIcon sx={{ fontSize: 16, color: '#637381' }} />}
        </ListItemButton>

        <Collapse in={paOpen} timeout="auto">
          <List disablePadding dense>
            {areas.map((area) => {
              const active = isAreaActive(area.id);
              return (
                <ListItemButton
                  key={area.id}
                  onClick={() => navigate(`/area/${area.id}`)}
                  disableRipple
                  sx={{
                    ...navItemSx(active),
                    '& .more-btn': { opacity: 0 },
                    '&:hover .more-btn': { opacity: 1 },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 30, color: active ? PRIMARY : '#637381' }}>
                    <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={area.name}
                    primaryTypographyProps={{
                      fontSize: '0.875rem',
                      fontWeight: active ? 600 : 500,
                      color: active ? PRIMARY : '#1a2332',
                    }}
                  />
                  <IconButton
                    size="small"
                    className="more-btn"
                    sx={{ p: 0.25, color: '#637381', flexShrink: 0 }}
                    onClick={(e) => handleKebabClick(e, area.id)}
                  >
                    <MoreVertIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </ListItemButton>
              );
            })}

            {/* Create New Area */}
            <ListItemButton
              onClick={() => { navigate('/'); onCreateArea?.(); }}
              disableRipple
              sx={{
                mx: 0.875, mb: 0.25, borderRadius: '6px', py: 0.75, px: 1.25, gap: 0.5,
                bgcolor: isHomeActive ? 'rgba(0,169,157,0.19)' : 'transparent',
                '&:hover': { bgcolor: isHomeActive ? 'rgba(0,169,157,0.19)' : 'rgba(0,0,0,0.04)' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 30, color: isHomeActive ? PRIMARY : '#637381' }}>
                <AddCircleOutlineIcon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Create New Area"
                primaryTypographyProps={{
                  fontSize: '0.875rem',
                  fontWeight: isHomeActive ? 600 : 400,
                  color: isHomeActive ? PRIMARY : '#637381',
                }}
              />
            </ListItemButton>
          </List>
        </Collapse>
      </Box>

      <Divider sx={{ borderColor: '#eeeeee' }} />

      {/* ── User profile ────────────────────────────────── */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#00a99d', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}>
          A
        </Avatar>
        <Box sx={{ overflow: 'hidden' }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1A2332', lineHeight: 1.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Allu Arjun
          </Typography>
          <Typography sx={{ fontSize: '0.75rem', color: 'rgba(26,35,50,0.54)', lineHeight: 1.3 }}>
            Jhukega Nahi
          </Typography>
        </Box>
      </Box>

      {/* ── Kebab menu ────────────────────────────────── */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{ sx: { borderRadius: '8px', minWidth: 140, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' } }}
      >
        <MenuItem
          onClick={() => openRename(menuAreaId!)}
          sx={{ fontSize: '0.875rem', gap: 1, py: 1 }}
        >
          <DriveFileRenameOutlineIcon sx={{ fontSize: 16, color: '#637381' }} />
          Rename
        </MenuItem>
        <MenuItem
          onClick={() => openDelete(menuAreaId!)}
          sx={{ fontSize: '0.875rem', gap: 1, py: 1, color: '#d32f2f' }}
        >
          <DeleteOutlineIcon sx={{ fontSize: 16, color: '#d32f2f' }} />
          Delete
        </MenuItem>
      </Menu>

      {/* ── Rename dialog ─────────────────────────────── */}
      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '10px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332', pb: 1 }}>
          Rename Processing Area
        </DialogTitle>
        <DialogContent sx={{ pt: '8px !important' }}>
          <TextField
            autoFocus
            fullWidth
            size="small"
            label="Area Name"
            value={renameName}
            onChange={(e) => setRenameName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && renameName.trim() && commitRename()}
            InputProps={{ sx: { borderRadius: '6px' } }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setRenameOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            disabled={!renameName.trim()}
            onClick={commitRename}
            sx={{ bgcolor: PRIMARY, textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#009188' } }}
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
      {/* ── Delete confirmation dialog ────────────────── */}
      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: '10px' } }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: '1rem', color: '#1a2332', pb: 1 }}>
          Delete Processing Area
        </DialogTitle>
        <DialogContent sx={{ pt: '4px !important' }}>
          <Typography sx={{ fontSize: '0.875rem', color: '#637381' }}>
            Are you sure you want to delete{' '}
            <strong style={{ color: '#1a2332' }}>
              {areas.find((a) => a.id === deleteTargetId)?.name}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setDeleteOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={commitDelete}
            sx={{ bgcolor: '#d32f2f', textTransform: 'none', borderRadius: '6px', '&:hover': { bgcolor: '#b71c1c' } }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
