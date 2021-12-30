import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import * as utils from '../components/Auth';

export const ProtectedRoute = () => {
  const auth = utils.getUser();

  return auth ? <Outlet /> : <Navigate to="/" />;
};
