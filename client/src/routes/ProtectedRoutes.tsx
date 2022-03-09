import React from 'react';
import { Switch } from 'react-router-dom';

import { Sidebar } from 'commonComponents';
import { PrivateRoute } from './PrivateRoute';
import { PrivateRoutes } from './routes';

export const ProtectedRoutes = () => (
  <>
    <Sidebar />
    <Switch>
      {PrivateRoutes.map(({ path, component }) => {
        return <PrivateRoute key={path} path={path} component={component} />;
      })}
    </Switch>
  </>
);
