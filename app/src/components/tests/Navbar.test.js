import { renderWithProviders } from '../../utils/test-utils';
import Navbar from '../Navbar';

it('renders correctly', () => {
    const preloadedState = {
        auth: { user: 'sarahedo' },
        employees: {
            entities: {
                sarahedo: {
                    id: 'sarahedo',
                    name: 'Sarah Edo',
                    avatarURL: 'https://i.pravatar.cc/250?img=47',
                },
            },
        },
    };

    const view = renderWithProviders(<Navbar />, { preloadedState });

    expect(view).toMatchSnapshot();
});
