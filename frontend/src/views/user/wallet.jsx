import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CssBaseline, Container, Typography, Stack, TextField, Button } from '@mui/material';
import { deposit } from '../../redux/actions/finance';
import Header from '../header';
 
const Wallet = ({ deposit, account, finance }) => {
  const [depositAmount, setDepositAmount] = useState(0);

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
  }

  return (
    <Fragment>
      <Header />
      <CssBaseline />
      <Container maxWidth="lg" className="bg-white shadow" style={{ padding: 25 }}>
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
        </Stack>
      </Container>
    </Fragment>
  )
};

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account,
    finance: state.finance,
  }
};

export default connect(mapStateToProps, {
  deposit,
})(Wallet);
