import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import { renderWithProviders } from './utils/test-utils';
import { API_HOST } from './mocks/handlers';
import { server } from './mocks/server';
import { rest } from 'msw';

it('renders login form at root if there is no authenticated user', () => {
    renderWithProviders(<App />);

    expect(screen.queryByText('Employee Polls')).not.toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
});

it('renders polls list for the authenticated user', () => {
    const preloadedState = { auth: { user: 'sarahedo' } };
    renderWithProviders(<App />, { preloadedState });

    expect(screen.getByText('Employee Polls')).toBeInTheDocument();
    expect(
        screen.queryByText('Sign in to your account')
    ).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Username')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Password')).not.toBeInTheDocument();
    expect(screen.queryByText('Submit')).not.toBeInTheDocument();
});

it('renders login form if user is not authenticated and route is unknown', () => {
    renderWithProviders(<App />, {
        route: { currentPath: '/some/random/stuff' },
    });

    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
});

it('redirects to 404 after login if route is unknown', async () => {
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

    renderWithProviders(<App />, {
        route: { currentPath: '/some/random/stuff' },
    });

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'tylermcginnis' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'abc321' },
    });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(
        () => {
            expect(
                screen.getByText('Failed to find anything...')
            ).toBeInTheDocument();
        },
        { timeout: 2000 }
    );
});

it('renders login form if user is not authenticated and route is meant for authenticated users', () => {
    renderWithProviders(<App />, {
        route: { currentPath: '/add' },
    });

    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
});

it('renders intended component after login if route is known', async () => {
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

    renderWithProviders(<App />, {
        route: { currentPath: '/add' },
    });

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'tylermcginnis' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'abc321' },
    });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(
        () => {
            expect(screen.getByText('Add New Poll')).toBeInTheDocument();
        },
        { timeout: 2000 }
    );
});

it('integrates', async () => {
    const chosenOptionClass = 'border-violet-600';

    renderWithProviders(<App />);

    // Login
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

    fireEvent.change(screen.getByPlaceholderText('Username'), {
        target: { value: 'tylermcginnis' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
        target: { value: 'abc321' },
    });
    fireEvent.click(screen.getByRole('button'));

    await waitFor(
        () => {
            expect(screen.getByText('Employee Polls')).toBeInTheDocument();
        },
        { timeout: 2000 }
    );

    expect(
        screen.queryByText('Sign in to your account')
    ).not.toBeInTheDocument();

    const navigation = screen.getByRole('navigation');
    const pollsLink = within(navigation).getByText('Polls');
    const addPollLink = within(navigation).getByText('New Poll');
    const leaderboardLink = within(navigation).getByText('Leaderboard');

    await waitFor(
        () => {
            expect(screen.getByText('Not responded')).toBeInTheDocument();
        },
        { timeout: 2000 }
    );

    // Check Leaderboard (should be on the third place with 2 responses & 2 polls)
    fireEvent.click(leaderboardLink);
    let leaderData = screen.getAllByTestId('leader-row')[2];
    expect(within(leaderData).getByTestId('leader-name')).toHaveTextContent(
        'Tyler McGinnis'
    );
    expect(
        within(leaderData).getByTestId('leader-responses')
    ).toHaveTextContent('2');
    expect(within(leaderData).getByTestId('leader-polls')).toHaveTextContent(
        '2'
    );

    // Back to polls
    fireEvent.click(pollsLink);

    expect(screen.getAllByTestId('poll-card').length).toBe(4);

    // Respond to first poll
    server.use(
        rest.post(`${API_HOST}/options/5/vote`, (req, res, ctx) => {
            return res(ctx.status(204), ctx.json());
        })
    );

    fireEvent.click(
        within(screen.getAllByTestId('poll-card')[0]).getByRole('link')
    );
    fireEvent.click(screen.getAllByTestId('poll-option')[0]);

    await waitFor(
        () =>
            expect(
                screen.getAllByTestId('responded-poll-option')[0]
            ).toHaveClass(chosenOptionClass),
        {
            timeout: 2000,
        }
    );

    fireEvent.click(pollsLink);

    expect(screen.getAllByTestId('poll-card').length).toBe(3);

    // Respond to second poll
    server.use(
        rest.post(`${API_HOST}/options/7/vote`, (req, res, ctx) => {
            return res(ctx.status(204), ctx.json());
        })
    );

    fireEvent.click(
        within(screen.getAllByTestId('poll-card')[0]).getByRole('link')
    );
    fireEvent.click(screen.getAllByTestId('poll-option')[0]);

    await waitFor(
        () =>
            expect(
                screen.getAllByTestId('responded-poll-option')[0]
            ).toHaveClass(chosenOptionClass),
        {
            timeout: 2000,
        }
    );

    fireEvent.click(pollsLink);

    expect(screen.getAllByTestId('poll-card').length).toBe(2);

    // Add new poll
    server.use(
        rest.post(`${API_HOST}/polls`, (req, res, ctx) => {
            return res(
                ctx.status(201),
                ctx.json({
                    data: {
                        id: 7,
                        key: '32iiirlv6o2hb156dzn3vu',
                        options: [
                            {
                                id: 13,
                                text: 'work',
                                pollId: 7,
                                updatedAt: '2023-07-08T18:50:51.816Z',
                                createdAt: '2023-07-08T18:50:51.816Z',
                            },
                            {
                                id: 14,
                                text: 'sleep',
                                pollId: 7,
                                updatedAt: '2023-07-08T18:50:51.817Z',
                                createdAt: '2023-07-08T18:50:51.817Z',
                            },
                        ],
                        authorId: 4,
                        updatedAt: '2023-07-08T18:50:51.794Z',
                        createdAt: '2023-07-08T18:50:51.794Z',
                    },
                })
            );
        })
    );

    fireEvent.click(addPollLink);

    fireEvent.change(screen.getByLabelText('First option'), {
        target: { value: 'work' },
    });
    fireEvent.change(screen.getByLabelText('Second option'), {
        target: { value: 'sleep' },
    });
    fireEvent.click(screen.getByText('Submit'));

    // Newly added poll lands in 'Not responded' section
    fireEvent.click(pollsLink);
    expect(screen.getAllByTestId('poll-card').length).toBe(2);

    await waitFor(
        () => {
            expect(screen.getAllByTestId('poll-card').length).toBe(3);
        },
        { timeout: 2000 }
    );

    // Respond to own poll
    server.use(
        rest.post(`${API_HOST}/options/13/vote`, (req, res, ctx) => {
            return res(ctx.status(204), ctx.json());
        })
    );

    fireEvent.click(
        within(screen.getAllByTestId('poll-card')[0]).getByRole('link')
    );

    expect(screen.getAllByTestId('poll-option')[0]).toHaveTextContent('work');
    expect(screen.getAllByTestId('poll-option')[1]).toHaveTextContent('sleep');

    fireEvent.click(screen.getAllByTestId('poll-option')[0]);

    await waitFor(
        () =>
            expect(
                screen.getAllByTestId('responded-poll-option')[0]
            ).toHaveClass(chosenOptionClass),
        {
            timeout: 2000,
        }
    );

    // Check Leaderboard (should be on the first place with 5 responses & 3 polls)
    fireEvent.click(leaderboardLink);
    leaderData = screen.getAllByTestId('leader-row')[0];
    expect(within(leaderData).getByTestId('leader-name')).toHaveTextContent(
        'Tyler McGinnis'
    );
    expect(
        within(leaderData).getByTestId('leader-responses')
    ).toHaveTextContent('5');
    expect(within(leaderData).getByTestId('leader-polls')).toHaveTextContent(
        '3'
    );

    // Logout
    fireEvent.click(within(navigation).getByAltText('Open user menu'));
    fireEvent.click(within(navigation).getByText('Sign out'));

    expect(screen.queryByText('Polling Leaders')).not.toBeInTheDocument();
    expect(screen.getByText('Sign in to your account')).toBeInTheDocument();
});
