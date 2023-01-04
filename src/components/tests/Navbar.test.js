import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { store } from '../../app/store';
import Navbar from '../Navbar';

it('renders correctly', () => {
    const view = render(
        <Provider store={store}>
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        </Provider>
    );

    expect(view).toMatchSnapshot();
});
