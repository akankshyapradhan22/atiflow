import Paper from '@mui/material/Paper';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import Badge from '@mui/material/Badge';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CalendarViewMonthIcon from '@mui/icons-material/CalendarViewMonth';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

export const BOTTOM_NAV_HEIGHT = 60;

const CREATE_PATHS = ['/history/create', '/history/checkout', '/history/container', '/history/container-checkout'];

const navItems = [
  { label: 'Create Request', icon: <AddCircleOutlineIcon />, path: '/history/create' },
  { label: 'My Requests',    icon: <ListAltIcon />,          path: '/history'         },
  { label: 'Staging Area',   icon: <CalendarViewMonthIcon />, path: '/staging'        },
  { label: 'Inventory',      icon: <Inventory2OutlinedIcon />, path: '/inventory'     },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const cart = useCartStore((s) => s.cart);

  const currentIdx = (() => {
    if (CREATE_PATHS.some((p) => pathname.startsWith(p))) return 0;
    return navItems.findIndex((item, i) => i > 0 && pathname.startsWith(item.path));
  })();

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        borderTop: '1px solid',
        borderColor: 'divider',
        height: BOTTOM_NAV_HEIGHT,
      }}
    >
      <BottomNavigation
        value={currentIdx === -1 ? false : currentIdx}
        onChange={(_, idx) => navigate(navItems[idx].path)}
        showLabels
        sx={{ height: BOTTOM_NAV_HEIGHT, bgcolor: 'background.paper' }}
      >
        {navItems.map((item, i) => (
          <BottomNavigationAction
            key={item.path}
            label={item.label}
            icon={
              i === 0 && cart.length > 0 ? (
                <Badge
                  badgeContent={cart.length}
                  color="primary"
                  sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', minWidth: 16, height: 16 } }}
                >
                  {item.icon}
                </Badge>
              ) : item.icon
            }
            sx={{
              fontSize: '0.7rem',
              '& .MuiBottomNavigationAction-label': { fontSize: '0.7rem', marginTop: '2px' },
              '&.Mui-selected': { color: 'primary.main' },
              minWidth: 'unset',
            }}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}
