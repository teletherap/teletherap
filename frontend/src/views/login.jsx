import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CssBaseline, Container, FormControl, TextField, Button, Grid } from '@mui/material';
import { login } from '../redux/actions/account';
import Header from './header';
 
const Login = ({ login, isFetching, isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const doLogin = (e) => {
    e.preventDefault();

    if (!username || !password) {
      toast.error('Please fill all the fields');
      return;
    }

    login(username, password);
  }

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <Header />
      <CssBaseline />
      <Container maxWidth="lg" className="bg-white shadow" style={{ padding: 25 }}>
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
      </Container>
    </Fragment>
  )
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
