import {
    fireEvent,
    screen,
    waitFor,
    within,
    act,
} from '@testing-library/react';
import format from 'date-fns/format';
import { renderWithProviders } from '../../../utils/test-utils';
import PollsList from '../PollsList';
import { fetchPolls } from '../pollsSlice';

const formatTimestamp = value =>
    format(new Date(value), "MMMM d, yyyy, 'at' HH:mm:ss");

const preloadedState = {
    auth: { user: 'mtsamis' },
    employees: {
        entities: {
            sarahedo: {
                id: 'sarahedo',
                name: 'Sarah Edo',
            },
            tylermcginnis: {
                id: 'tylermcginnis',
                name: 'Tyler McGinnis',
            },
            mtsamis: {
                id: 'mtsamis',
                name: 'Mike Tsamis',
                answers: {
                    xj352vofupe1dqz9emx13r: 11,
                    vthrdm985a262al8qx3do: 10,
                    '6ni6ok3ym7mf1p33lnez': 4,
                },
            },
            zoshikanlu: {
                id: 'zoshikanlu',
                name: 'Zenobia Oshikanlu',
            },
        },
    },
};

it('renders and behaves correctly', async () => {
    const { store } = renderWithProviders(<PollsList />, { preloadedState });

    expect(screen.getByText('Employee Polls')).toBeInTheDocument();

    await act(async () => store.dispatch(fetchPolls()));

    await waitFor(() => expect(store.getState().polls.ids.length).toBe(6), {
        timeout: 2000,
    });

    const notResponded = screen.getByText('Not responded');
    const responded = screen.getByText('Responded');

    // Polls, to which the employee has not responded are shown by default

    expect(notResponded).toHaveClass('underline');
    expect(notResponded).not.toHaveClass('cursor-pointer');
    expect(responded).toHaveClass('cursor-pointer');
    expect(responded).not.toHaveClass('underline');

    const notRespondedPolls = screen.getAllByTestId('poll-card');
    expect(notRespondedPolls.length).toBe(3);

    expect(
        within(notRespondedPolls[0]).getByText('Sarah Edo')
    ).toBeInTheDocument();
    expect(
        within(notRespondedPolls[0]).getByText(formatTimestamp(1488579767190))
    ).toBeInTheDocument();
    expect(within(notRespondedPolls[0]).getByRole('link')).toHaveAttribute(
        'href',
        '/questions/am8ehyc8byjqgar0jgpub9'
    );

    expect(
        within(notRespondedPolls[1]).getByText('Tyler McGinnis')
    ).toBeInTheDocument();
    expect(
        within(notRespondedPolls[1]).getByText(formatTimestamp(1482579767190))
    ).toBeInTheDocument();
    expect(within(notRespondedPolls[1]).getByRole('link')).toHaveAttribute(
        'href',
        '/questions/loxhs1bqm25b708cmbf3g'
    );

    expect(
        within(notRespondedPolls[2]).getByText('Sarah Edo')
    ).toBeInTheDocument();
    expect(
        within(notRespondedPolls[2]).getByText(formatTimestamp(1467166872634))
    ).toBeInTheDocument();
    expect(within(notRespondedPolls[2]).getByRole('link')).toHaveAttribute(
        'href',
        '/questions/8xf0y6ziyjabvozdd253nd'
    );

    // Switch to the polls, to which the employee has already responded

    fireEvent.click(responded);

    expect(notResponded).not.toHaveClass('underline');
    expect(notResponded).toHaveClass('cursor-pointer');
    expect(responded).not.toHaveClass('cursor-pointer');
    expect(responded).toHaveClass('underline');

    const respondedPolls = screen.getAllByTestId('poll-card');
    expect(respondedPolls.length).toBe(3);

    expect(
        within(respondedPolls[0]).getByText('Mike Tsamis')
    ).toBeInTheDocument();
    expect(
        within(respondedPolls[0]).getByText(formatTimestamp(1493579767190))
    ).toBeInTheDocument();
    expect(within(respondedPolls[0]).getByRole('link')).toHaveAttribute(
        'href',
        '/questions/xj352vofupe1dqz9emx13r'
    );

    expect(
        within(respondedPolls[1]).getByText('Tyler McGinnis')
    ).toBeInTheDocument();
    expect(
        within(respondedPolls[1]).getByText(formatTimestamp(1489579767190))
    ).toBeInTheDocument();
    expect(within(respondedPolls[1]).getByRole('link')).toHaveAttribute(
        'href',
        '/questions/vthrdm985a262al8qx3do'
    );

    expect(
        within(respondedPolls[2]).getByText('Mike Tsamis')
    ).toBeInTheDocument();
    expect(
        within(respondedPolls[2]).getByText(formatTimestamp(1468479767190))
    ).toBeInTheDocument();
    expect(within(respondedPolls[2]).getByRole('link')).toHaveAttribute(
        'href',
        '/questions/6ni6ok3ym7mf1p33lnez'
    );
});
