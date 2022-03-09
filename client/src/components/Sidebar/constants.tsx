import React, { ReactNode } from 'react';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import HomeIcon from '@material-ui/icons/Home';

interface INAV_LINK {
  icon: ReactNode;
  title: string;
  link: string;
}

export const NAV_LINKS: INAV_LINK[] = [
  { icon: <AccountBalanceWalletIcon />, title: 'budget', link: '/budget' },
  { icon: <HomeIcon />, title: 'communal', link: '/communal' },
];
