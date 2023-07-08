import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import { API_HOST } from '../../../mocks/handlers';
import { server } from '../../../mocks/server';
import { rest } from 'msw';
import AddPollForm from '../AddPollForm';

const preloadedState = {
    auth: { user: 'zoshikanlu' },
    employees: {
        entities: {
            zoshikanlu: {
                id: 'zoshikanlu',
                name: 'Zenobia Oshikanlu',
                avatarURL: 'https://i.pravatar.cc/250?img=49',
                answers: {},
                questions: [],
            },
        },
    },
};

it('renders and behaves correctly', async () => {
    const errorMessage = 'Options should be distinct';
    const { store } = renderWithProviders(<AddPollForm />, { preloadedState });

    expect(screen.getByText('Add New Poll')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute(
        'src',
        'https://i.pravatar.cc/250?img=49'
    );
    expect(screen.getByText('Would you rather...')).toBeInTheDocument();

    const firstOption = screen.getByLabelText('First option');
    const secondOption = screen.getByLabelText('Second option');
    const submitButton = screen.getByRole('button', { type: 'submit' });

    expect(firstOption).toHaveAttribute('name', 'first-option');
    expect(secondOption).toHaveAttribute('name', 'second-option');
    expect(submitButton).toHaveTextContent('Submit');

    // Submit with empty options
    fireEvent.click(submitButton);
    expect(store.getState().polls.entities).toStrictEqual({});
    expect(
        store.getState().employees.entities['zoshikanlu'].questions
    ).toStrictEqual([]);

    // Submit with only first option
    fireEvent.change(firstOption, { target: { value: 'work' } });
    fireEvent.click(submitButton);
    expect(store.getState().polls.entities).toStrictEqual({});
    expect(
        store.getState().employees.entities['zoshikanlu'].questions
    ).toStrictEqual([]);

    // Submit with only second option
    fireEvent.change(firstOption, { target: { value: '' } });
    fireEvent.change(secondOption, { target: { value: 'sleep' } });
    fireEvent.click(submitButton);
    expect(store.getState().polls.entities).toStrictEqual({});
    expect(
        store.getState().employees.entities['zoshikanlu'].questions
    ).toStrictEqual([]);

    // Submit with two equal options
    fireEvent.change(firstOption, { target: { value: 'sleep' } });
    fireEvent.change(secondOption, { target: { value: 'sleep' } });
    fireEvent.click(submitButton);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
    expect(store.getState().polls.entities).toStrictEqual({});
    expect(
        store.getState().employees.entities['zoshikanlu'].questions
    ).toStrictEqual([]);

    // Successful submit
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

    fireEvent.change(firstOption, { target: { value: 'work' } });
    fireEvent.change(secondOption, { target: { value: 'sleep' } });
    fireEvent.click(submitButton);
    expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();

    await waitFor(
        () => {
            expect(store.getState().polls.ids.length).toBe(1);
        },
        { timeout: 2000 }
    );

    const [pollId] = store.getState().polls.ids;

    expect(
        store.getState().employees.entities['zoshikanlu'].questions
    ).toStrictEqual([pollId]);

    const poll = store.getState().polls.entities[pollId];

    expect(poll.id).toBe(pollId);
    expect(poll.author).toBe('zoshikanlu');
    expect(poll.options[13]).toStrictEqual({ id: 13, text: 'work', votes: [] });
    expect(poll.options[14]).toStrictEqual({
        id: 14,
        text: 'sleep',
        votes: [],
    });
});

it('stores multiple polls correctly', async () => {
    const { store } = renderWithProviders(<AddPollForm />, { preloadedState });

    const firstOption = screen.getByLabelText('First option');
    const secondOption = screen.getByLabelText('Second option');
    const submitButton = screen.getByRole('button', { type: 'submit' });

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

    fireEvent.change(firstOption, { target: { value: 'work' } });
    fireEvent.change(secondOption, { target: { value: 'sleep' } });
    fireEvent.click(submitButton);

    await waitFor(
        () => {
            expect(store.getState().polls.ids.length).toBe(1);
        },
        { timeout: 2000 }
    );

    const [firstPollId] = store.getState().polls.ids;

    server.use(
        rest.post(`${API_HOST}/polls`, (req, res, ctx) => {
            return res(
                ctx.status(201),
                ctx.json({
                    data: {
                        id: 8,
                        key: '33iiirlv6o2hb156dzn3vu',
                        options: [
                            {
                                id: 15,
                                text: 'play chess',
                                pollId: 8,
                                updatedAt: '2023-07-08T18:51:51.816Z',
                                createdAt: '2023-07-08T18:51:51.816Z',
                            },
                            {
                                id: 16,
                                text: 'play checkers',
                                pollId: 8,
                                updatedAt: '2023-07-08T18:51:51.817Z',
                                createdAt: '2023-07-08T18:51:51.817Z',
                            },
                        ],
                        authorId: 4,
                        updatedAt: '2023-07-08T18:51:51.794Z',
                        createdAt: '2023-07-08T18:51:51.794Z',
                    },
                })
            );
        })
    );

    fireEvent.change(firstOption, { target: { value: 'play chess' } });
    fireEvent.change(secondOption, { target: { value: 'play checkers' } });
    fireEvent.click(submitButton);

    await waitFor(
        () => {
            expect(store.getState().polls.ids.length).toBe(2);
        },
        { timeout: 2000 }
    );

    const [secondPollId] = store.getState().polls.ids;

    expect(firstPollId).not.toBe(secondPollId);
    expect(store.getState().polls.ids).toStrictEqual([
        secondPollId,
        firstPollId,
    ]);
    expect(
        store.getState().employees.entities['zoshikanlu'].questions
    ).toStrictEqual([firstPollId, secondPollId]);

    const firstPoll = store.getState().polls.entities[firstPollId];
    expect(firstPoll.id).toBe(firstPollId);
    expect(firstPoll.author).toBe('zoshikanlu');
    expect(firstPoll.options[13]).toStrictEqual({
        id: 13,
        text: 'work',
        votes: [],
    });
    expect(firstPoll.options[14]).toStrictEqual({
        id: 14,
        text: 'sleep',
        votes: [],
    });

    const secondPoll = store.getState().polls.entities[secondPollId];
    expect(secondPoll.id).toBe(secondPollId);
    expect(secondPoll.author).toBe('zoshikanlu');
    expect(secondPoll.options[15]).toStrictEqual({
        id: 15,
        text: 'play chess',
        votes: [],
    });
    expect(secondPoll.options[16]).toStrictEqual({
        id: 16,
        text: 'play checkers',
        votes: [],
    });
});
