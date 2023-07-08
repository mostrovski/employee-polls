import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import { API_HOST } from '../../../mocks/handlers';
import { server } from '../../../mocks/server';
import { rest } from 'msw';
import SinglePoll from '../SinglePoll';

const preloadedState = {
    auth: { user: 'tylermcginnis' },
    employees: {
        status: 'succeeded',
        entities: {
            sarahedo: {
                id: 'sarahedo',
                name: 'Sarah Edo',
                avatarURL: 'https://i.pravatar.cc/250?img=47',
            },
            tylermcginnis: {
                id: 'tylermcginnis',
                name: 'Tyler McGinnis',
                avatarURL: 'https://i.pravatar.cc/250?img=67',
                answers: {
                    vthrdm985a262al8qx3do: 9,
                },
            },
        },
    },
    polls: {
        status: 'succeeded',
        entities: {
            '8xf0y6ziyjabvozdd253nd': {
                id: '8xf0y6ziyjabvozdd253nd',
                author: 'sarahedo',
                timestamp: 1467166872000,
                options: {
                    1: {
                        id: 1,
                        text: 'Build our new application with Javascript',
                        votes: ['sarahedo'],
                    },
                    2: {
                        id: 2,
                        text: 'Build our new application with Typescript',
                        votes: [],
                    },
                },
            },
            vthrdm985a262al8qx3do: {
                id: 'vthrdm985a262al8qx3do',
                author: 'tylermcginnis',
                timestamp: 1489579767000,
                options: {
                    9: {
                        id: 9,
                        text: 'take a course on ReactJS',
                        votes: ['tylermcginnis'],
                    },
                    10: {
                        id: 10,
                        text: 'take a course on unit testing with Jest',
                        votes: ['mtsamis'],
                    },
                },
            },
        },
    },
};

const chosenOptionClass = 'border-violet-600';

it('renders the poll, to which the employee has already responded', () => {
    const route = {
        currentPath: '/questions/vthrdm985a262al8qx3do',
        matchPath: '/questions/:question_id',
        wrap: true,
    };

    renderWithProviders(<SinglePoll />, { preloadedState, route });

    expect(screen.getByTestId('author-avatar')).toHaveAttribute(
        'src',
        'https://i.pravatar.cc/250?img=67'
    );
    expect(screen.getByText('Would you rather')).toBeInTheDocument();

    const options = screen.getAllByTestId('responded-poll-option');
    expect(options.length).toBe(2);

    // First option:
    expect(options[0]).toHaveClass(chosenOptionClass);
    expect(within(options[0]).getByTestId('option-text')).toHaveTextContent(
        'take a course on ReactJS'
    );
    expect(within(options[0]).getByTestId('option-stats')).toHaveTextContent(
        '50% (1 voted)'
    );
    // Click does not affect the stats:
    fireEvent.click(options[0]);
    expect(within(options[0]).getByTestId('option-stats')).toHaveTextContent(
        '50% (1 voted)'
    );

    // Second option:
    expect(options[1]).not.toHaveClass(chosenOptionClass);
    expect(within(options[1]).getByTestId('option-text')).toHaveTextContent(
        'take a course on unit testing with Jest'
    );
    expect(within(options[1]).getByTestId('option-stats')).toHaveTextContent(
        '50% (1 voted)'
    );
    // Click does not affect the stats:
    fireEvent.click(options[1]);
    expect(within(options[1]).getByTestId('option-stats')).toHaveTextContent(
        '50% (1 voted)'
    );
});

it('renders the poll, to which the employee has not responded yet', async () => {
    const route = {
        currentPath: '/questions/8xf0y6ziyjabvozdd253nd',
        matchPath: '/questions/:question_id',
        wrap: true,
    };

    renderWithProviders(<SinglePoll />, { preloadedState, route });

    expect(screen.getByTestId('author-avatar')).toHaveAttribute(
        'src',
        'https://i.pravatar.cc/250?img=47'
    );
    expect(screen.getByText('Would you rather')).toBeInTheDocument();

    // No stats shown:
    expect(screen.queryByText('%')).not.toBeInTheDocument();
    expect(screen.queryByText('voted')).not.toBeInTheDocument();

    const options = screen.getAllByTestId('poll-option');
    expect(options.length).toBe(2);

    expect(options[0]).toHaveClass('cursor-pointer');
    expect(within(options[0]).getByTestId('option-text')).toHaveTextContent(
        'Build our new application with Javascript'
    );

    expect(options[1]).toHaveClass('cursor-pointer');
    expect(within(options[1]).getByTestId('option-text')).toHaveTextContent(
        'Build our new application with Typescript'
    );

    // Changes to displaying the stats when responded:
    server.use(
        rest.post(`${API_HOST}/options/1/vote`, (req, res, ctx) => {
            return res(ctx.status(204), ctx.json());
        })
    );

    fireEvent.click(options[0]);
    options.forEach(option => expect(option).not.toBeInTheDocument());

    const optionStats = screen.getAllByTestId('responded-poll-option');
    expect(optionStats.length).toBe(2);

    // Stats reflect the choice
    await waitFor(() => expect(optionStats[0]).toHaveClass(chosenOptionClass), {
        timeout: 2000,
    });
    // First option:
    expect(within(optionStats[0]).getByTestId('option-text')).toHaveTextContent(
        'Build our new application with Javascript'
    );
    expect(
        within(optionStats[0]).getByTestId('option-stats')
    ).toHaveTextContent('100% (2 voted)');
    // Second option:
    expect(within(optionStats[1]).getByTestId('option-text')).toHaveTextContent(
        'Build our new application with Typescript'
    );
    expect(
        within(optionStats[1]).getByTestId('option-stats')
    ).toHaveTextContent('0% (0 voted)');
});
