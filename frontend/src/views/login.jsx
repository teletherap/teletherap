import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormControl, TextField, Button, Grid } from '@mui/material';
import { login } from '../redux/actions/account';
import Config from '../config';

const Login = ({ login, isFetching, isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    document.title = `Login | ${Config.Title}`;
  });

  const doLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please fill all the fields');
      return;
    }

    login(username, password);
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={doLogin}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl margin="normal">
            <TextField label="Username" value={username} onChange={e => setUsername(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl margin="normal">
            <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl margin="normal">
            <Button type="submit" variant="contained" color="primary" disabled={isFetching}>
              Login
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    isFetching: state.account.isFetching,
    isLoggedIn: state.account.isLoggedIn,
  }
};

export default connect(mapStateToProps, {
  login,
})(Login);
