import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './views/home';
import Login from './views/login';
import Register from './views/register';
import NotFound from './views/notFound';
import ActivateAccount from './views/activateAccount';
import UpdateTherapist from './views/user/therapist';
import Wallet from './views/user/wallet';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path='/activate/:username/:token' component={ActivateAccount} />
        <Route exact path="/user/therapist" component={UpdateTherapist} />
        <Route exact path="/user/wallet" component={Wallet} />
        <Route exact path='/' component={Home} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
