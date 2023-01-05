import { renderWithProviders } from '../../utils/test-utils';
import NotFound from '../NotFound';

it('renders correctly', () => {
    const view = renderWithProviders(<NotFound />);

    expect(view).toMatchSnapshot();
});
