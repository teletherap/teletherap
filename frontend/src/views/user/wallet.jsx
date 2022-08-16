import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import { CssBaseline, Container, Typography, Stack } from '@mui/material';
import Header from '../header';
 
const Wallet = ({ account }) => {

  if (!account.isLoggedIn) {
    toast.error('You are not authorized to view this page');
    return <Redirect to="/" />;
  }

  return (
    <Fragment>
      <Header />
      <CssBaseline />
      <Container maxWidth="lg" className="bg-white shadow" style={{ padding: 25 }}>
        <Stack spacing={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Wallet
          </Typography>
          <Typography variant="h5" component="p" gutterBottom>
            Your ballance is {account.walletBalance} IRT.
          </Typography>
        </Stack>
      </Container>
    </Fragment>
  )
};

const mapStateToProps = (state, ownProps) => {
  return {
    account: state.account,
  }
};

export default connect(mapStateToProps, {})(Wallet);
