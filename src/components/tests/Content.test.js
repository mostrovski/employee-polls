import { render } from '@testing-library/react';
import Content from '../Content';

it('renders correctly as such', () => {
    const view = render(<Content heading="Content" />);

    expect(view).toMatchSnapshot();
});

it('renders correctly as a wrapper', () => {
    const view = render(
        <Content heading="Content">
            <div>Content goes here</div>
        </Content>
    );

    expect(view).toMatchSnapshot();
});
