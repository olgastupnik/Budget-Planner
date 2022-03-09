import { Profile, Budget, Communal, NotFound } from 'pages';

interface IRoute {
  path: string;
  component: (() => JSX.Element) | React.FC<{}>;
  '/profile'?: RegExp;
}

const PrivateRoutes: IRoute[] = [
  { path: '/profile', component: Profile },
  { path: '/budget', component: Budget },
  { path: '/communal', component: Communal },
  { path: '*', component: NotFound },
];

export { PrivateRoutes };
