import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FormControl, TextField, Button, Grid } from '@mui/material';
import { register } from '../redux/actions/account';
import Config from '../config';

const Register = ({ register, isFetching, isLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  useEffect(() => {
    document.title = `Register | ${Config.Title}`;
  });

  const doRegister = (e, type) => {
    e.preventDefault();

    if (!username || !password || !password2 || !email || !firstName || !lastName) {
      toast.error('Please fill all the fields');
      return;
    }

    register(type, username, password, password2, email, firstName, lastName);
  }

  if (isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <form onSubmit={doRegister}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl margin="normal">
            <TextField
              label="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)} />
          </FormControl>
          <FormControl margin="normal">
            <TextField
              label="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl margin="normal">
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)} />
          </FormControl>
          <FormControl margin="normal">
            <TextField
              label="Confirm Password"
              type="password"
              value={password2}
              onChange={e => setPassword2(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl margin="normal">
            <TextField
              label="Username"
              value={username}
              onChange={e => setUsername(e.target.value)} />
          </FormControl>
          <FormControl margin="normal">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)} />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl margin="normal">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isFetching}
              onClick={e => doRegister(e, 'client')}>
              Register as Client
            </Button>
          </FormControl>
          <FormControl margin="normal">
            <Button type="submit" variant="contained" color="primary" disabled={isFetching} onClick={e => doRegister(e, 'therapist')}>
              Register as Therapist
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
  register,
})(Register);
