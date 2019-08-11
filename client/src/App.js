import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import Index from './pages/Index';
import CreateUser from './pages/CreateUser';

function App() {
  return (
    <div>
      <Router>
        <Switch>
          <Route path="/" exact component={Index} />
          <Route path="/users" component={CreateUser} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
