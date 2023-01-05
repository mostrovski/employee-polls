import { renderWithProviders } from '../../utils/test-utils';
import Shell from '../Shell';

it('renders correctly as such', () => {
    const view = renderWithProviders(<Shell />);

    expect(view).toMatchSnapshot();
});

it('renders correctly as a wrapper', () => {
    const view = renderWithProviders(
        <Shell>
            <div>Shell content goes here</div>
        </Shell>
    );

    expect(view).toMatchSnapshot();
});
