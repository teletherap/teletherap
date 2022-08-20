import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Typography, Stack, TextField, Button } from '@mui/material';
import { deposit, withdraw } from '../../redux/actions/finance';
import Config from '../../config';

const Wallet = ({ deposit, withdraw, account }) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawIban, setWithdrawIban] = useState('');

  useEffect(() => {
    document.title = `Wallet | ${Config.Title}`;
  });

  if (!account.isLoggedIn) {
    toast.error('You are not authorized to view this page');
    return <Navigate to="/" />;
  }

  const doDeposit = async (e) => {
    e.preventDefault();

    if (!depositAmount) {
      toast.error('Please fill all the fields');
      return;
    }

    await deposit(depositAmount);
    setDepositAmount(0);
  }

  const doWithdraw = async (e) => {
    e.preventDefault();

    if (!withdrawAmount || !withdrawIban) {
      toast.error('Please fill all the fields');
      return;
    }

    await withdraw(withdrawAmount, withdrawIban);
    setWithdrawAmount(0);
    setWithdrawIban('');
  }

  return (
    <Stack direction="row" spacing={3}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Wallet
        </Typography>
        <Typography variant="h5" component="p" gutterBottom>
          Your ballance is {account.walletBalance} IRT.
        </Typography>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Deposit
        </Typography>
        <form onSubmit={doDeposit}>
          <Stack direction="row" spacing={3}>
            <TextField
              label="Amount (IRT)"
              type="number"
              value={depositAmount}
              onChange={e => setDepositAmount(e.target.value)} />
            <Button type="submit" variant="contained" color="primary">
              Deposit
            </Button>
          </Stack>
        </form>
      </Stack>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Withdraw
        </Typography>
        <form onSubmit={doWithdraw}>
          <Stack direction="row" spacing={3}>
            <TextField
              label="Amount (IRT)"
              type="number"
              value={withdrawAmount}
              onChange={e => setWithdrawAmount(e.target.value)} />
            <TextField
              label="IBAN"
              type="text"
              value={withdrawIban}
              onChange={e => setWithdrawIban(e.target.value)} />
            <Button type="submit" variant="contained" color="primary">
              Withdraw
            </Button>
          </Stack>
        </form>
      </Stack>
    </Stack>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account,
  }
};

export default connect(mapStateToProps, {
  deposit, withdraw,
})(Wallet);
