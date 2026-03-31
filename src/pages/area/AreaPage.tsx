import { useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WidgetsOutlinedIcon from '@mui/icons-material/WidgetsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import RouteOutlinedIcon from '@mui/icons-material/RouteOutlined';
import PrecisionManufacturingOutlinedIcon from '@mui/icons-material/PrecisionManufacturingOutlined';
import MaterialConfigPage from '../material/MaterialConfigPage';
import ContainerConfigPage from '../container/ContainerConfigPage';
import WorkflowConfigPage from '../workflow/WorkflowConfigPage';
import StagingAreaPage from '../staging/StagingAreaPage';
import StationMappingPage from './StationMappingPage';
import WIPInventoryPage from './WIPInventoryPage';
import ProcessingAreaTab from './ProcessingAreaTab';
import { mockProcessingAreas } from '../../data/mock';
import { PRIMARY } from '../../theme';

const AREA_TABS = [
  { label: 'Materials',       icon: <WidgetsOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Containers',      icon: <Inventory2OutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Workflow',        icon: <AccountTreeOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'WIP Inventory',   icon: <WarehouseOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Staging Area',    icon: <GridViewOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Station Mapping',  icon: <RouteOutlinedIcon sx={{ fontSize: 18 }} /> },
  { label: 'Processing Area',  icon: <PrecisionManufacturingOutlinedIcon sx={{ fontSize: 18 }} /> },
] as const;

export default function AreaPage() {
  const { areaId } = useParams<{ areaId: string }>();
  const [tabIdx, setTabIdx] = useState(0);

  const area = mockProcessingAreas.find((a) => a.id === areaId);
  if (!area) return <Navigate to="/area/rotr" replace />;

  const tabLabel = AREA_TABS[tabIdx].label;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* ── Header bar ───────────────────────────────── */}
      <Box sx={{ bgcolor: '#ffffff', borderBottom: '1px solid #e8e8e8', flexShrink: 0 }}>

        {/* Breadcrumb row */}
        <Box sx={{ px: 3, pt: 1.75, pb: 1, display: 'flex', alignItems: 'center', gap: 0.75 }}>
          <Typography sx={{ fontSize: '0.8125rem', color: '#637381', fontWeight: 500 }}>
            Processing Area
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: '#9EA8B3' }} />
          <Typography sx={{ fontSize: '0.8125rem', color: '#637381', fontWeight: 500 }}>
            {area.name}
          </Typography>
          <ChevronRightIcon sx={{ fontSize: 14, color: '#9EA8B3' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.375 }}>
            <Typography sx={{ fontSize: '0.8125rem', color: '#1a2332', fontWeight: 600 }}>
              {tabLabel}
            </Typography>
            <ExpandMoreIcon sx={{ fontSize: 16, color: '#637381' }} />
          </Box>
        </Box>

        <Divider sx={{ borderColor: '#f0f0f0' }} />

        {/* Tabs */}
        <Tabs
          value={tabIdx}
          onChange={(_, v) => setTabIdx(v)}
          sx={{
            px: 1,
            minHeight: 48,
            '& .MuiTab-root': {
              minHeight: 48,
              fontSize: '0.8125rem',
              fontWeight: 500,
              color: '#637381',
              textTransform: 'none',
              px: 1.5,
              py: 0,
              gap: 0.75,
              flexDirection: 'row',
              alignItems: 'center',
              '&.Mui-selected': { color: PRIMARY, fontWeight: 600 },
            },
            '& .MuiTabs-indicator': { backgroundColor: PRIMARY, height: 2 },
            '& .MuiTab-iconWrapper': { mb: '0 !important' },
          }}
        >
          {AREA_TABS.map((tab) => (
            <Tab
              key={tab.label}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              disableRipple
            />
          ))}
        </Tabs>
      </Box>

      {/* ── Tab content ──────────────────────────────── */}
      <Box sx={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {tabIdx === 0 && <MaterialConfigPage embedded />}
        {tabIdx === 1 && <ContainerConfigPage embedded />}
        {tabIdx === 2 && <WorkflowConfigPage embedded />}
        {tabIdx === 3 && <WIPInventoryPage />}
        {tabIdx === 4 && <StagingAreaPage embedded />}
        {tabIdx === 5 && <StationMappingPage embedded />}
        {tabIdx === 6 && <ProcessingAreaTab />}
      </Box>
    </Box>
  );
}

function ComingSoonPlaceholder({ label }: { label: string }) {
  return (
    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
      <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
        {label} — coming soon
      </Typography>
    </Box>
  );
}
