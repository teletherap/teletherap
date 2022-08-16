import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './views/home';
import Login from './views/login';
import Register from './views/register';
import NotFound from './views/notFound';
import ActivateAccount from './views/activateAccount';
import UpdateTherapist from './views/user/therapist';
import Wallet from './views/user/wallet';
import VerifyDeposit from './views/user/verifyDeposit';

const App = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;
