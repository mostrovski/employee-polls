import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../app/store';
import Shell from '../Shell';

it('renders correctly as such', () => {
    const view = render(
        <Provider store={store}>
            <Shell />
        </Provider>
    );

    expect(view).toMatchSnapshot();
});

it('renders correctly as a wrapper', () => {
    const view = render(
        <Provider store={store}>
            <Shell>
                <div>Shell content goes here</div>
            </Shell>
        </Provider>
    );

    expect(view).toMatchSnapshot();
});
