import { useHistory } from 'react-router-dom';
import React from 'react';

import './NotFound.css';

export const NotFound: React.FC = () => {
  const history = useHistory();

  const handleClick = () => {
    history.push('/profile');
  };

  return (
    <div className="container notFound">
      <h1>404</h1>
      <h3>OPPS! PAGE NOT BE FOUND</h3>
      <p>
        Sorry but the age you are looking for does not exist, have been removed, name changed or is temporarily
        unavailable
      </p>
      <button data-testid="backToProfile" type="button" onClick={handleClick}>
        BACK TO PROFILE PAGE
      </button>
    </div>
  );
};
