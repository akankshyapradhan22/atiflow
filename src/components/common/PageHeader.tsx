import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

interface PageHeaderProps {
  title: string;
  actions?: React.ReactNode;
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        px: 3,
        pt: 2,
        pb: 1.5,
        borderBottom: '1px solid #E8ECEF',
        bgcolor: 'background.paper',
        flexShrink: 0,
        width: '100%',
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', color: '#1A2332' }}>
        {title}
      </Typography>
      {actions && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {actions}
        </Box>
      )}
    </Box>
  );
}
