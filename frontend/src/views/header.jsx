import React, { useState } from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled'
import { AppBar, Toolbar, Button, Typography, Menu, MenuItem, Box, IconButton } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useHistory } from "react-router-dom";
import { logout } from '../redux/actions/account';
import Config from '../config';


const Header = ({ logout, isLoggedIn, username }) => {
  const history = useHistory();
  const userMenuId = 'user-menu';
  const [userAnchorEl, setUserAnchorEl] = useState(null)
  const isUserMenuOpen = Boolean(userAnchorEl);

  const handleUserMenuOpen = event => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserAnchorEl(null);
  };

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
      <MenuItem disabled>Wellcome, {username}</MenuItem>
      <MenuItem onClick={logout}>Logout</MenuItem>
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
      <MenuItem onClick={() => history.push('/login')}>Login</MenuItem>
      <MenuItem onClick={() => history.push('/register')}>Register</MenuItem>
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
            onClick={() => history.push('/')}>
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
  }
};

export default connect(mapStateToProps, {
  logout,
})(Header);
