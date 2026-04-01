import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import CreateAreaDialog from '../../pages/home/CreateAreaDialog';
import { useProcessingAreas } from '../../context/ProcessingAreasContext';
import type { DialogMachine } from '../../pages/home/CreateAreaDialog';

export default function AppLayout() {
  const navigate = useNavigate();
  const { addArea } = useProcessingAreas();
  const [createOpen, setCreateOpen] = useState(false);

  const handleSave = (name: string, machines: DialogMachine[]) => {
    setCreateOpen(false);
    const id = name.toLowerCase().replace(/\s+/g, '-');
    addArea(
      { id, name },
      machines.map((m, i) => ({ ...m, id: `mch-${i}-${Date.now()}` }))
    );
    navigate(`/area/${id}`);
  };

  return (
    <Box sx={{
      width: '100%',
      maxWidth: 1366,
      mx: 'auto',
      height: '100vh',
      overflow: 'hidden',
      bgcolor: '#e9e9e9',
      display: 'flex',
      p: 1.5,
      gap: 1.5,
    }}>
      {/* Sidebar card */}
      <Box sx={{
        flexShrink: 0,
        height: '100%',
        borderRadius: '10px',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        bgcolor: '#fff',
      }}>
        <Sidebar onCreateArea={() => setCreateOpen(true)} />
      </Box>

      {/* Content card */}
      <Box
        component="main"
        sx={{
          flex: 1,
          minWidth: 0,
          height: '100%',
          borderRadius: '10px',
          border: '1px solid #e0e0e0',
          overflow: 'hidden',
          bgcolor: '#fff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Outlet />
      </Box>

      <CreateAreaDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleSave}
      />
    </Box>
  );
}
