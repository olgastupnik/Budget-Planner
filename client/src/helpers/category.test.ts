import { findCategoryById, findCategoryByTitle } from './category';

const categories = [
  {
    id: '7bbd1c0c-7c07-4b15-a5b6-3abe8ff4abb8',
    title: '123',
    description: '123123',
    isDefault: false,
  },
  {
    id: '6c1d6366-1d3e-439e-b523-39dfbc48b2d8',
    title: 'qrwq',
    description: 'aaad',
    isDefault: false,
  },
];

describe('Category helper', () => {
  it('should find category by title', () => {
    expect(findCategoryByTitle('123', categories)).toBe(categories[0]);
  });

  it('should find category by incorrect title', () => {
    expect(findCategoryByTitle('11', categories)).toBe(undefined);
  });

  it('should find category by incorrect id', () => {
    expect(findCategoryById('11', categories)).toBe(undefined);
  });

  it('should find category by id', () => {
    expect(findCategoryById('7bbd1c0c-7c07-4b15-a5b6-3abe8ff4abb8', categories)).toBe(categories[0]);
  });
});
