import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

import { NotFound } from '.';

describe('NotFound', () => {
  test('Should redirect to Profile page', () => {
    const history = createMemoryHistory();

    render(
      <Router history={history}>
        <NotFound />
      </Router>,
    );

    expect(screen.getByText('404')).toBeInTheDocument();

    const buttonBackProfile = screen.getByTestId('backToProfile');
    userEvent.click(buttonBackProfile);

    expect(history.location.pathname).toBe('/profile');
  });
});
