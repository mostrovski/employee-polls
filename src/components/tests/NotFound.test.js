import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NotFound from '../NotFound';

it('renders correctly', () => {
    const view = render(
        <MemoryRouter>
            <NotFound />
        </MemoryRouter>
    );

    expect(view).toMatchSnapshot();
});
