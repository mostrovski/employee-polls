import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import { API_HOST } from '../../../mocks/handlers';
import { server } from '../../../mocks/server';
import { rest } from 'msw';
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
    server.use(
        rest.post(`${API_HOST}/auth`, (req, res, ctx) => {
            return res(
                ctx.status(404),
                ctx.json({
                    error: 'Not found',
                })
            );
        })
    );

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
    server.use(
        rest.post(`${API_HOST}/auth`, (req, res, ctx) => {
            return res(
                ctx.status(200),
                ctx.json({
                    user: 'tylermcginnis',
                })
            );
        })
    );

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
