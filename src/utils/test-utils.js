// https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { setupStore } from '../app/store';

export const renderWithProviders = (
    component,
    {
        preloadedState = {},
        store = setupStore(preloadedState),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({ children }) => {
        return (
            <Provider store={store}>
                <MemoryRouter>{children}</MemoryRouter>
            </Provider>
        );
    };

    return {
        store,
        ...render(component, { wrapper: Wrapper, ...renderOptions }),
    };
};
