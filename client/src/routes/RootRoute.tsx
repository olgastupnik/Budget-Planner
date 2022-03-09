import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import { Login, NotFound, Registration } from 'pages';
import { PrivateRoute } from './PrivateRoute';
import { ProtectedRoutes } from './ProtectedRoutes';

export const RootRoute: () => JSX.Element = () => (
  <main>
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/profile" />} />
      <Route exact path="/reg" component={Registration} />
      <Route exact path="/login" component={Login} />
      <PrivateRoute component={ProtectedRoutes} />
      <PrivateRoute path="*" component={NotFound} />
    </Switch>
  </main>
);
