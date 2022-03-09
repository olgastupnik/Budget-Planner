import React from 'react';
import { Redirect, Route } from 'react-router-dom';

interface IPrivateRoute {
  component: (() => JSX.Element) | React.FC<{}>;
  [propName: string]: any;
}

export const PrivateRoute = ({ component: Component, ...props }: IPrivateRoute) => {
  const isAuth = sessionStorage.getItem('token');

  return (
    <Route
      {...props}
      render={(componentProps) =>
        isAuth ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: componentProps.location },
            }}
          />
        )
      }
    />
  );
};
