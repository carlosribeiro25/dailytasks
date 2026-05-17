import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import LogoutIcon from '@mui/icons-material/Logout';

const pages = [
  { label: 'Minhas Tarefas', path: '/tasks' },
  { label: 'Criar tarefa', path: '/cadastrar' },
  { label: 'Filtro', path: '/tasks/filter' },
];

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <AppBar position="fixed">
      <Container maxWidth="xl">
        <Toolbar disableGutters>

          <Typography
            variant="h6"
            noWrap
            component={NavLink}
            to="/"
            sx={{
              mr: 3,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 900,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'left' }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map(({ label, path }) => (
                <MenuItem
                  key={path}
                  component={NavLink}
                  to={path}
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">{label}</Typography>
                </MenuItem>
              ))}
              <Divider />
              <MenuItem onClick={() => { handleCloseNavMenu(); handleLogout(); }}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography textAlign="center">Sair</Typography>
              </MenuItem>
            </Menu>
          </Box>

          <Typography
            variant="h6"
            noWrap
            component={NavLink}
            to="/"
            sx={{
              flexGrow: 2,
              display: { xs: 'flex', md: 'none' },
              fontWeight: 900,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            DalyTaks
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map(({ label, path }) => (
              <Button
                key={path}
                component={NavLink}
                to={path}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {label}
              </Button>
            ))}

          </Box>

          {/* Logout — desktop */}
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: 'white', display: { xs: 'none', md: 'flex' } }}
          >
            Sair
          </Button>

        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
