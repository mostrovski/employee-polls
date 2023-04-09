import { fireEvent, screen } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import LogoutButton from '../LogoutButton';

it('renders and behaves correctly', () => {
    const preloadedState = { auth: { user: 'sarahedo' } };

    const { store } = renderWithProviders(<LogoutButton />, { preloadedState });
    const button = screen.getByRole('button');

    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveTextContent('Sign out');
    expect(store.getState().auth.user).toBe('sarahedo');

    fireEvent.click(button);

    expect(store.getState().auth.user).toBe(null);
});
