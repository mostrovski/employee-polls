import { fireEvent, screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
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
    expect(poll.optionOne).toStrictEqual({ votes: [], text: 'work' });
    expect(poll.optionTwo).toStrictEqual({ votes: [], text: 'sleep' });
});

it('stores multiple polls correctly', async () => {
    const { store } = renderWithProviders(<AddPollForm />, { preloadedState });

    const firstOption = screen.getByLabelText('First option');
    const secondOption = screen.getByLabelText('Second option');
    const submitButton = screen.getByRole('button', { type: 'submit' });

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
    expect(firstPoll.optionOne).toStrictEqual({ votes: [], text: 'work' });
    expect(firstPoll.optionTwo).toStrictEqual({ votes: [], text: 'sleep' });

    const secondPoll = store.getState().polls.entities[secondPollId];
    expect(secondPoll.id).toBe(secondPollId);
    expect(secondPoll.author).toBe('zoshikanlu');
    expect(secondPoll.optionOne).toStrictEqual({
        votes: [],
        text: 'play chess',
    });
    expect(secondPoll.optionTwo).toStrictEqual({
        votes: [],
        text: 'play checkers',
    });
});
