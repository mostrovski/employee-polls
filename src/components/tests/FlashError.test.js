import { render } from '@testing-library/react';
import FlashError from '../FlashError';

it('renders correctly with message', () => {
    const view = render(<FlashError message="Error message" />);

    expect(view).toMatchSnapshot();
});

it('renders empty when message is not truthy', () => {
    const view = render(<FlashError message={null} />);

    expect(view).toMatchSnapshot();
});
