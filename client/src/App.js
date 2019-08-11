import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Index from './pages/Index';
import CreateUser from './pages/CreateUser';

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={Index} />
        <Route path="/signup" component={CreateUser} />
      </Switch>
    </div>
  );
}

export default App;
