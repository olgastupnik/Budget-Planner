/* eslint-disable import/no-unresolved */
import React from 'react';
import ReactDOM from 'react-dom';

import { App } from './App';

import './assets/style.css';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);

ReactDOM.render(<App />, document.getElementById('root'));
