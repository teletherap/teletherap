import React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled'
import { AppBar, Toolbar, Button, Typography } from '@mui/material';
import { useHistory } from "react-router-dom";
import { logout } from '../redux/actions/account';
import Config from '../config';


const Header = ({ logout, isLoggedIn }) => {
  const history = useHistory()
  const Flexed = styled.div(props => ({
    flexGrow: 1,
  }))

  return (
    <Flexed>
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
            <div>
              <Button color="inherit"
                onClick={() => history.push('/dashboard')}>
                Dashboard
              </Button>
              <Button color="inherit"
                onClick={logout}>
                Logout
              </Button>
            </div>
          ) : (
            <div>
              <Button color="inherit"
                onClick={() => history.push('/login')}>
                Login
              </Button>
              <Button color="inherit"
                onClick={() => history.push('/register')}>
                Register
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Flexed>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    isLoggedIn: state.account.isLoggedIn,
  }
};

export default connect(mapStateToProps, {
  logout,
})(Header);
