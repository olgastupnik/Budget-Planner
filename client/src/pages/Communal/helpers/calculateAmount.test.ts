import { TComunalCategory } from 'types';
import { Convert, tryConvert, filterAmount, getTotal } from './calculateAmount';

describe('CalculateAmount helper', () => {
  it('should convert amount by title', () => {
    expect(Convert(123, 'water')).toEqual(206.64);
  });

  it('should convert amount by incorrect title', () => {
    expect(Convert(123, 'gg' as TComunalCategory)).toBe(NaN);
  });

  it('should tryConvert amount by incorrect title', () => {
    expect(tryConvert(123, 'gg' as TComunalCategory)).toBe(NaN);
  });

  it('should tryConvert amount by title', () => {
    expect(tryConvert(19, 'water')).toEqual(31.92);
  });

  it('should filterAmount amount by title', () => {
    expect(filterAmount('water', { water: 1, gas: 2, heating: 3 })).toEqual(1);
  });

  it('should filterAmount amount by incorrect title', () => {
    expect(filterAmount('heatting' as TComunalCategory, { water: 1, gas: 2, heating: 3 })).toEqual(undefined);
  });

  it('should getTotal sum of communal', () => {
    expect(getTotal({ water: 1, gas: 1, heating: 1, timestamp: '2021-11-09T15:07:23.641Z' })).toEqual(1752.3);
  });
});
