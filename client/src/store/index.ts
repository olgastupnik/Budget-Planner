import { createContext } from 'react';
import { RootStore } from './RootStore';

export default createContext(new RootStore());
