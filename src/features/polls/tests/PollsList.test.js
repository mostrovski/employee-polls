import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import PollsList from '../PollsList';
import { fetchPolls } from '../pollsSlice';

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
                    xj352vofupe1dqz9emx13r: 'optionOne',
                    vthrdm985a262al8qx3do: 'optionTwo',
                    '6ni6ok3ym7mf1p33lnez': 'optionOne',
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

    store.dispatch(fetchPolls());

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
        within(notRespondedPolls[0]).getByText('March 3, 2017, at 23:22:47')
    ).toBeInTheDocument();
    expect(within(notRespondedPolls[0]).getByRole('link')).toHaveAttribute(
        'href',
        '/polls/am8ehyc8byjqgar0jgpub9'
    );

    expect(
        within(notRespondedPolls[1]).getByText('Tyler McGinnis')
    ).toBeInTheDocument();
    expect(
        within(notRespondedPolls[1]).getByText('December 24, 2016, at 12:42:47')
    ).toBeInTheDocument();
    expect(within(notRespondedPolls[1]).getByRole('link')).toHaveAttribute(
        'href',
        '/polls/loxhs1bqm25b708cmbf3g'
    );

    expect(
        within(notRespondedPolls[2]).getByText('Sarah Edo')
    ).toBeInTheDocument();
    expect(
        within(notRespondedPolls[2]).getByText('June 29, 2016, at 04:21:12')
    ).toBeInTheDocument();
    expect(within(notRespondedPolls[2]).getByRole('link')).toHaveAttribute(
        'href',
        '/polls/8xf0y6ziyjabvozdd253nd'
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
        within(respondedPolls[0]).getByText('April 30, 2017, at 21:16:07')
    ).toBeInTheDocument();
    expect(within(respondedPolls[0]).getByRole('link')).toHaveAttribute(
        'href',
        '/polls/xj352vofupe1dqz9emx13r'
    );

    expect(
        within(respondedPolls[1]).getByText('Tyler McGinnis')
    ).toBeInTheDocument();
    expect(
        within(respondedPolls[1]).getByText('March 15, 2017, at 13:09:27')
    ).toBeInTheDocument();
    expect(within(respondedPolls[1]).getByRole('link')).toHaveAttribute(
        'href',
        '/polls/vthrdm985a262al8qx3do'
    );

    expect(
        within(respondedPolls[2]).getByText('Mike Tsamis')
    ).toBeInTheDocument();
    expect(
        within(respondedPolls[2]).getByText('July 14, 2016, at 09:02:47')
    ).toBeInTheDocument();
    expect(within(respondedPolls[2]).getByRole('link')).toHaveAttribute(
        'href',
        '/polls/6ni6ok3ym7mf1p33lnez'
    );
});
