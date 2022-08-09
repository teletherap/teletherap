import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './views/home';
import Login from './views/login';
import Register from './views/register';
import NotFound from './views/notFound';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path='/' component={Home} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
