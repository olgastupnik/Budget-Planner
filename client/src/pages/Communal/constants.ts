import { TComunalCategory } from 'types';

export const COMMUNAL: { label: TComunalCategory }[] = [{ label: 'water' }, { label: 'gas' }, { label: 'heating' }];

export const COMMUNAL_RATIO: Record<string, number> = {
  water: 1.68,
  gas: 2.15,
  heating: 1748.47,
};
