import { render } from '@testing-library/react';
import PendingContent from '../PendingContent';

it('renders correctly with default prop values', () => {
    const view = render(<PendingContent />);

    expect(view).toMatchSnapshot();
});

it('renders correctly with heading', () => {
    const view = render(<PendingContent heading="Content" />);

    expect(view).toMatchSnapshot();
});
