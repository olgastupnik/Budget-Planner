import React, { MouseEventHandler } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import Brightness4Icon from '@material-ui/icons/Brightness4';

import { darkTheme, GlobalStyles, lightTheme, useDarkMode } from 'commonComponents';
import { RootRoute } from 'routes';
import RootStore from 'store';

import './assets/style.css';
import './index.css';

export const App = () => {
  const [theme, themeToggler] = useDarkMode();

  const themeMode = theme === 'light' ? lightTheme : darkTheme;

  return (
    <Provider rootStore={RootStore}>
      <ThemeProvider theme={themeMode}>
        <GlobalStyles />
        <Router>
          <RootRoute />
        </Router>
        <button className="toggleBtn" type="button" onClick={themeToggler as MouseEventHandler<HTMLButtonElement>}>
          {theme === 'light' ? <WbSunnyIcon /> : <Brightness4Icon />}
        </button>
      </ThemeProvider>
    </Provider>
  );
};
