import React, { useState } from 'react';
import { connect } from 'react-redux';
import { AppBar, Toolbar, Button, Typography, Menu, MenuItem, Box, IconButton, ListItemText, ListItemIcon } from '@mui/material';
import { AccountCircle, Person, AccountBalanceWallet } from '@mui/icons-material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from "react-router-dom";
import { logout } from '../redux/actions/account';
import Config from '../config';

const Header = ({ logout, isLoggedIn, username, isTherapist, walletBalance }) => {
  const navigate = useNavigate();
  const userMenuId = 'user-menu';
  const [userAnchorEl, setUserAnchorEl] = useState(null)
  const isUserMenuOpen = Boolean(userAnchorEl);

  const handleUserMenuOpen = event => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

  const doLogout = () => {
    navigate('/');
    logout();
  }

  const renderUserMenu = (
    <Menu
      anchorEl={userAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={userMenuId}
      keepMounted
      open={isUserMenuOpen}
      onClose={handleUserMenuClose}
    >
      <MenuItem disabled>
        <ListItemIcon>
          <Person fontSize="small" />
        </ListItemIcon>
        <ListItemText primary={`Welcome, ${username}`} />
      </MenuItem>
      {isTherapist ? (
        <MenuItem onClick={() => navigate('/user/therapist')}>
          <ListItemIcon>
            <PsychologyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Professional Info"
            secondary="View and Edit"
          />
        </MenuItem>
      ) : (
        <MenuItem onClick={() => navigate('/user/client')}>
          <ListItemIcon>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Personal Info"
            secondary="View and Edit"
          />
        </MenuItem>
      )}
      <MenuItem onClick={() => navigate('/user/wallet')}>
        <ListItemIcon>
          <AccountBalanceWallet fontSize="small" />
        </ListItemIcon>
        <ListItemText 
          primary="Wallet"
          secondary={`${walletBalance} IRT`}
        />
      </MenuItem>
      <MenuItem onClick={() => navigate('/user/calendar')}>
        <ListItemIcon>
          <CalendarMonthIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Calendar"
          secondary="See your appointments"
        />
      </MenuItem>
      <MenuItem onClick={doLogout}>
        <ListItemIcon>
          <LogoutIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  );

  const renderLoginRegisterMenu = (
    <Menu
      anchorEl={userAnchorEl}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={userMenuId}
      keepMounted
      open={isUserMenuOpen}
      onClose={handleUserMenuClose}
    >
      <MenuItem onClick={() => navigate('/login')}>
        <ListItemIcon>
          <LoginIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText primary="Login" />
      </MenuItem>
      <MenuItem onClick={() => navigate('/register')}>
        <ListItemIcon>
          <PersonAddAltIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary="Register"
          secondary="As a therapist or client"
        />
      </MenuItem>
    </Menu>
  );

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ marginRight: 10, color: 'yellow' }}>
            {Config.Title}
          </Typography>
          <Button color="inherit"
            onClick={() => navigate('/')}>
            Home
          </Button>
          {isLoggedIn ? (
            <Box>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls={userMenuId}
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          ) : (
            <Box>
              <IconButton
                size="large"
                aria-label="login/register"
                aria-controls={userMenuId}
                aria-haspopup="true"
                onClick={handleUserMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      {isLoggedIn ? renderUserMenu : renderLoginRegisterMenu}
    </Box>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.account.isLoggedIn,
    username: state.account.username,
    isTherapist: state.account.isTherapist,
    walletBalance: state.account.walletBalance
  }
};

export default connect(mapStateToProps, {
  logout,
})(Header);
