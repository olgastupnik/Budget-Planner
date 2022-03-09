import React, { useState, useContext, ReactNode, useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import RootStore from 'store';
import { clearToken } from 'helpers';
import { NAV_LINKS } from './constants';

import './Sidebar.css';

interface ISidebar {
  icon: ReactNode;
  title: string;
  link: string;
}

export const Sidebar: React.FC = observer(() => {
  const {
    profileStore: { initialForm, getUser },
  } = useContext(RootStore);

  const history = useHistory();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const changeOpenHandler = (): void => {
    setIsOpen(!isOpen);
  };

  const logoutHandler = () => {
    history.push('/login');
    clearToken();
  };

  useEffect(() => {
    getUser();
  }, [initialForm.email, initialForm.firstName, initialForm.lastName]);

  return (
    <aside className={isOpen ? 'asideActive' : 'aside'}>
      <div>
        <div className="profBox">
          <img
            src="https://i2.wp.com/www.cssscript.com/wp-content/uploads/2020/12/Customizable-SVG-Avatar-Generator-In-JavaScript-Avataaars.js.png?fit=438%2C408&ssl=1"
            alt="avatar"
          />
          <div className="userInf">
            <h3>{`${initialForm.firstName} ${initialForm.lastName}`}</h3>
            <NavLink to="/profile">View profile</NavLink>
          </div>
        </div>
      </div>

      <nav>
        <ul>
          {NAV_LINKS.map(({ icon, title, link }: ISidebar) => {
            return (
              <li key={title}>
                <NavLink to={link} activeClassName="active" className="linkBox">
                  {icon}
                  <span className="linkText">{title}</span>
                </NavLink>
              </li>
            );
          })}
          <li className="linkBox ">
            <button type="button" className="logout" onClick={logoutHandler}>
              <ExitToAppIcon />
              <span className="linkText">Exit</span>
            </button>
          </li>
          ;
        </ul>
      </nav>
      <button type="button" className="arrowBox" onClick={changeOpenHandler}>
        {isOpen ? <ArrowBackIosIcon /> : <ArrowForwardIosIcon />}
      </button>
    </aside>
  );
});
