import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import LoginForm from '../LoginForm';

it('renders and behaves correctly', async () => {
    const errorMessage = 'Username or password is not valid';

    const { store } = renderWithProviders(<LoginForm />);

    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    const username = screen.getByPlaceholderText('Username');
    const password = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { type: 'submit' });

    expect(submitButton).toHaveTextContent('Sign in');
    expect(store.getState().auth.user).toBe(null);

    // First attempt:
    fireEvent.change(username, { target: { value: 'tylermcginnis' } });
    fireEvent.change(password, { target: { value: 'abc123' } });
    fireEvent.click(submitButton);

    await waitFor(
        () => {
            expect(screen.getByText(errorMessage)).toBeInTheDocument();
        },
        { timeout: 2000 }
    );

    expect(store.getState().auth.user).toBe(null);

    // Second attempt:
    fireEvent.change(username, { target: { value: 'tylermcginnis' } });
    fireEvent.change(password, { target: { value: 'abc321' } });
    fireEvent.click(submitButton);

    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    await waitFor(
        () => {
            expect(store.getState().auth.user).toBe('tylermcginnis');
        },
        { timeout: 2000 }
    );
});
