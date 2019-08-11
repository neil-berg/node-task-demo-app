import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Index from './pages/Index';
import CreateUser from './pages/CreateUser';

function App() {
  return (
    <div>
      <Router>
        <Route path="/" exact component={CreateUser} />
        <Route path="/signup" exact component={CreateUser} />
      </Router>
    </div>
  );
}

export default App;
