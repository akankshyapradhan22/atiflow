import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';

interface SearchBarProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  extra?: React.ReactNode;
}

export default function SearchBar({ value, onChange, placeholder = 'Search', extra }: SearchBarProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
      <Box sx={{
        display: 'flex', alignItems: 'center', gap: 1,
        px: 1.5, py: 0.75,
        border: '1px solid #DDE1E6',
        borderRadius: '8px',
        bgcolor: '#fff',
        width: 280,
        transition: 'border-color 0.15s',
        '&:focus-within': { borderColor: '#009688' },
      }}>
        <SearchIcon sx={{ fontSize: 16, color: '#9E9E9E', flexShrink: 0 }} />
        <InputBase
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          sx={{ fontSize: '0.875rem', color: '#1A2332', flex: 1, '& input': { p: 0 } }}
        />
      </Box>
      {extra}
      <IconButton size="small" sx={{
        color: '#637381',
        border: '1px solid #DDE1E6',
        borderRadius: '8px',
        p: 0.875,
        '&:hover': { borderColor: '#bdbdbd', bgcolor: 'rgba(0,0,0,0.02)' },
      }}>
        <FilterListIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Box>
  );
}
