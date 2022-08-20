import React, { Fragment } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container, CssBaseline } from '@mui/material';
import Home from './views/home';
import Login from './views/login';
import Register from './views/register';
import NotFound from './views/notFound';
import ActivateAccount from './views/activateAccount';
import UpdateTherapist from './views/user/therapist';
import Wallet from './views/user/wallet';
import VerifyDeposit from './views/user/verifyDeposit';
import Header from './views/header';

const App = () => {
  return (
    <BrowserRouter>
      <Fragment>
        <Header />
        <CssBaseline />
        <Container maxWidth="lg" className="bg-white shadow" style={{ padding: 25 }}>
          <Routes>
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path='/activate/:username/:token' element={<ActivateAccount />} />
            <Route exact path="/user/therapist" element={<UpdateTherapist />} />
            <Route exact path="/user/wallet" element={<Wallet />} />
            <Route exact path="/user/deposit/verify/:username/:amount" element={<VerifyDeposit />} />
            <Route exact path='/' element={<Home />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Container>
      </Fragment>
    </BrowserRouter>
  );
};

export default App;
