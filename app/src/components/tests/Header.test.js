import { render } from '@testing-library/react';
import Header from '../Header';

it('renders correctly', () => {
    const view = render(<Header title="Header" />);

    expect(view).toMatchSnapshot();
});
