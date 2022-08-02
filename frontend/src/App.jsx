import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Home from './components/home';
import NotFound from './components/notFound';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Home} />
        <Route component={NotFound} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
