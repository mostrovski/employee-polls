import { render } from '@testing-library/react';
import Main from '../Main';

it('renders correctly as such', () => {
    const view = render(<Main />);

    expect(view).toMatchSnapshot();
});

it('renders correctly as a wrapper', () => {
    const view = render(
        <Main>
            <div>Main goes here</div>
        </Main>
    );

    expect(view).toMatchSnapshot();
});
