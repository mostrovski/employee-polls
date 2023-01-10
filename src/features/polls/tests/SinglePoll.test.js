import { screen, within } from '@testing-library/react';
import { renderWithProviders } from '../../../utils/test-utils';
import SinglePoll from '../SinglePoll';

const preloadedState = {
    auth: { user: 'tylermcginnis' },
    employees: {
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
                    vthrdm985a262al8qx3do: 'optionOne',
                },
            },
        },
    },
    polls: {
        entities: {
            '8xf0y6ziyjabvozdd253nd': {
                id: '8xf0y6ziyjabvozdd253nd',
                author: 'sarahedo',
                optionOne: {
                    votes: ['sarahedo'],
                    text: 'Build our new application with Javascript',
                },
                optionTwo: {
                    votes: [],
                    text: 'Build our new application with Typescript',
                },
            },
            vthrdm985a262al8qx3do: {
                id: 'vthrdm985a262al8qx3do',
                author: 'tylermcginnis',
                optionOne: {
                    votes: ['tylermcginnis'],
                    text: 'take a course on ReactJS',
                },
                optionTwo: {
                    votes: ['mtsamis'],
                    text: 'take a course on unit testing with Jest',
                },
            },
        },
    },
};

it('renders already responded poll correctly', () => {
    const route = {
        matchPath: '/polls/:pollId',
        currentPath: '/polls/vthrdm985a262al8qx3do',
    };

    renderWithProviders(<SinglePoll />, { preloadedState, route });

    expect(screen.getByTestId('author-avatar')).toHaveAttribute(
        'src',
        'https://i.pravatar.cc/250?img=67'
    );
    expect(screen.getByText('Would you rather')).toBeInTheDocument();

    const options = screen.getAllByTestId('responded-poll-option');
    const chosenOptionClass = 'border-violet-600';

    expect(options.length).toBe(2);

    expect(options[0]).toHaveClass(chosenOptionClass);
    expect(within(options[0]).getByTestId('option-text')).toHaveTextContent(
        'take a course on ReactJS'
    );
    expect(within(options[0]).getByTestId('option-stats')).toHaveTextContent(
        '50% (1 voted)'
    );

    expect(options[1]).not.toHaveClass(chosenOptionClass);
    expect(within(options[1]).getByTestId('option-text')).toHaveTextContent(
        'take a course on unit testing with Jest'
    );
    expect(within(options[1]).getByTestId('option-stats')).toHaveTextContent(
        '50% (1 voted)'
    );
});
