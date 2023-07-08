import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import Leaderboard from '../Leaderboard';

const preloadedState = {
    auth: { user: 'tylermcginnis' },
    employees: {
        entities: {
            sarahedo: {
                id: 'sarahedo',
                name: 'Sarah Edo',
                avatarURL: 'https://i.pravatar.cc/250?img=47',
                answers: {
                    '8xf0y6ziyjabvozdd253nd': 1,
                    '6ni6ok3ym7mf1p33lnez': 4,
                    am8ehyc8byjqgar0jgpub9: 6,
                    loxhs1bqm25b708cmbf3g: 8,
                },
                questions: ['8xf0y6ziyjabvozdd253nd', 'am8ehyc8byjqgar0jgpub9'],
            },
            tylermcginnis: {
                id: 'tylermcginnis',
                name: 'Tyler McGinnis',
                avatarURL: 'https://i.pravatar.cc/250?img=67',
                answers: {
                    vthrdm985a262al8qx3do: 9,
                    xj352vofupe1dqz9emx13r: 12,
                },
                questions: ['loxhs1bqm25b708cmbf3g', 'vthrdm985a262al8qx3do'],
            },
            mtsamis: {
                id: 'mtsamis',
                name: 'Mike Tsamis',
                avatarURL: 'https://i.pravatar.cc/250?img=59',
                answers: {
                    xj352vofupe1dqz9emx13r: 11,
                    vthrdm985a262al8qx3do: 10,
                    '6ni6ok3ym7mf1p33lnez': 4,
                },
                questions: ['6ni6ok3ym7mf1p33lnez', 'xj352vofupe1dqz9emx13r'],
            },
            zoshikanlu: {
                id: 'zoshikanlu',
                name: 'Zenobia Oshikanlu',
                avatarURL: 'https://i.pravatar.cc/250?img=49',
                answers: {
                    xj352vofupe1dqz9emx13r: 11,
                },
                questions: [],
            },
        },
    },
};

it('renders the table with leaders in the right order', () => {
    renderWithProviders(<Leaderboard />, { preloadedState });
    expect(screen.getByText('Polling Leaders')).toBeInTheDocument();

    const tableRows = screen.getAllByTestId('leader-row');
    expect(tableRows.length).toBe(4);

    // First place
    expect(within(tableRows[0]).getByTestId('leader-avatar')).toHaveAttribute(
        'src',
        'https://i.pravatar.cc/250?img=47'
    );
    expect(within(tableRows[0]).getByTestId('leader-name')).toHaveTextContent(
        'Sarah Edo'
    );
    expect(
        within(tableRows[0]).getByTestId('leader-responses')
    ).toHaveTextContent('4');
    expect(within(tableRows[0]).getByTestId('leader-polls')).toHaveTextContent(
        '2'
    );

    // Second place
    expect(within(tableRows[1]).getByTestId('leader-avatar')).toHaveAttribute(
        'src',
        'https://i.pravatar.cc/250?img=59'
    );
    expect(within(tableRows[1]).getByTestId('leader-name')).toHaveTextContent(
        'Mike Tsamis'
    );
    expect(
        within(tableRows[1]).getByTestId('leader-responses')
    ).toHaveTextContent('3');
    expect(within(tableRows[1]).getByTestId('leader-polls')).toHaveTextContent(
        '2'
    );

    // Third place
    expect(within(tableRows[2]).getByTestId('leader-avatar')).toHaveAttribute(
        'src',
        'https://i.pravatar.cc/250?img=67'
    );
    expect(within(tableRows[2]).getByTestId('leader-name')).toHaveTextContent(
        'Tyler McGinnis'
    );
    expect(
        within(tableRows[2]).getByTestId('leader-responses')
    ).toHaveTextContent('2');
    expect(within(tableRows[2]).getByTestId('leader-polls')).toHaveTextContent(
        '2'
    );

    // Fourth place
    expect(within(tableRows[3]).getByTestId('leader-avatar')).toHaveAttribute(
        'src',
        'https://i.pravatar.cc/250?img=49'
    );
    expect(within(tableRows[3]).getByTestId('leader-name')).toHaveTextContent(
        'Zenobia Oshikanlu'
    );
    expect(
        within(tableRows[3]).getByTestId('leader-responses')
    ).toHaveTextContent('1');
    expect(within(tableRows[3]).getByTestId('leader-polls')).toHaveTextContent(
        '0'
    );
});

it('highlights the authenticated employee', () => {
    renderWithProviders(<Leaderboard />, { preloadedState });

    const tableRows = screen.getAllByTestId('leader-row');
    expect(tableRows.length).toBe(4);

    // authenticated employee:
    expect(tableRows[2]).toHaveClass('animate-pulse');

    // other employees:
    expect(tableRows[0]).not.toHaveClass('animate-pulse');
    expect(tableRows[1]).not.toHaveClass('animate-pulse');
    expect(tableRows[3]).not.toHaveClass('animate-pulse');
});
