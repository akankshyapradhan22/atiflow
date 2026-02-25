import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

export default function SettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        <Box sx={{ px: 3, pt: 2.5, pb: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1A2332', mb: 2 }}>
            Settings
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              minHeight: 40,
              '& .MuiTab-root': { minHeight: 40, fontSize: '0.875rem', fontWeight: 400, color: '#637381', px: 2 },
              '& .Mui-selected': { color: '#00a99d', fontWeight: 600 },
              '& .MuiTabs-indicator': { bgcolor: '#00a99d', height: 2 },
            }}
          >
            <Tab label="General" />
            <Tab label="Available" />
            <Tab label="Finishing soon" />
            <Tab label="Out of Stock" />
          </Tabs>
        </Box>

        <Box sx={{ flex: 1, p: 3, overflow: 'auto', scrollbarGutter: 'stable' }}>
          {tab === 0 && (
            <Typography sx={{ fontSize: '0.875rem', color: '#9E9E9E' }}>
              General settings coming soon.
            </Typography>
          )}
          {tab === 1 && (
            <Typography sx={{ fontSize: '0.875rem', color: '#9E9E9E' }}>
              Available threshold settings coming soon.
            </Typography>
          )}
          {tab === 2 && (
            <Typography sx={{ fontSize: '0.875rem', color: '#9E9E9E' }}>
              Finishing soon threshold settings coming soon.
            </Typography>
          )}
          {tab === 3 && (
            <Typography sx={{ fontSize: '0.875rem', color: '#9E9E9E' }}>
              Out of stock alert settings coming soon.
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}
