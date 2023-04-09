import { render } from '@testing-library/react';
import Button from '../Button';

it('renders correctly with default prop values', () => {
    const view = render(<Button text="Button" />);

    expect(view).toMatchSnapshot();
});

it('renders correctly with type', () => {
    const view = render(<Button text="Submit" type="submit" />);

    expect(view).toMatchSnapshot();
});

it('renders correctly with icon', () => {
    const view = render(<Button text="Icon button" icon="login" />);

    expect(view).toMatchSnapshot();
});

it('renders correctly with callback', () => {
    const view = render(
        <Button
            text="Callback button"
            onClick={() => console.log('callback')}
        />
    );

    expect(view).toMatchSnapshot();
});

it('renders correctly with all props provided', () => {
    const view = render(
        <Button
            text="Super button"
            type="submit"
            icon="logout"
            onClick={() => console.log('callback')}
        />
    );

    expect(view).toMatchSnapshot();
});
