import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';

import SplashScreen from './SplashScreen';
import UserScreen from './UserScreen';

const App = () => {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route exact path="/" element={<SplashScreen />} />
        <Route path="/" element={<ProtectedRoute />}>
          <Route exact path="/user" element={<UserScreen />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
