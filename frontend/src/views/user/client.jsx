import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Typography, TextField, Button, Stack } from '@mui/material';
import { getPersonalClientInfo, updatePersonalClientInfo } from '../../redux/actions/account';
import Config from '../../config';
 
const Client = ({ getPersonalClientInfo, updatePersonalClientInfo, account }) => {
  const [telegramUsername, setTelegramUsername] = useState(account.client.telegramUsername);

  useEffect(() => {
    document.title = `Personal Info | ${Config.Title}`;
  });

  useEffect(() => {
    getPersonalClientInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTelegramUsername(account.client.telegramUsername);
  }, [account.client]);

  const doUpdate = (e) => {
    e.preventDefault();

    if (!telegramUsername) {
      toast.error('Please fill all fields');
      return;
    }

    updatePersonalClientInfo(telegramUsername);
  };

  if (!account.isLoggedIn || account.isTherapist) {
    toast.error('You are not authorized to view this page');
    return <Navigate to="/" />;
  }

  return (
    <Stack spacing={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Personal Information
      </Typography>
      <form onSubmit={doUpdate}>
        <Stack spacing={3}>
          <TextField
            label="Telegram username"
            value={telegramUsername}
            onChange={e => setTelegramUsername(e.target.value)} />
          <Button type="submit" variant="contained" color="primary" disabled={account.isFetching}>
            Update
          </Button>
        </Stack>
      </form>
    </Stack>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account,
  }
};

export default connect(mapStateToProps, {
  getPersonalClientInfo, updatePersonalClientInfo,
})(Client);
