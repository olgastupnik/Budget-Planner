import React from 'react';

import RootStore from 'store';
import { MyForm } from './components/Form';

import './Profile.css';

export const Profile: React.FC = () => {
  return (
    <div className="profileBox">
      <div className="formBox">
        <h1>Profile page</h1>
        <MyForm />
      </div>
    </div>
  );
};
