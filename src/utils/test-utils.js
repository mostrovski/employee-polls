// https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { setupStore } from '../app/store';

export const renderWithProviders = (
    component,
    {
        preloadedState = {},
        route = { currentPath: '/', matchPath: '/', wrap: false },
        store = setupStore(preloadedState),
        ...renderOptions
    } = {}
) => {
    const Wrapper = ({ children }) => {
        return (
            <Provider store={store}>
                <MemoryRouter initialEntries={[`${route.currentPath}`]}>
                    {children}
                </MemoryRouter>
            </Provider>
        );
    };

    if (route.wrap) {
        return {
            store,
            ...render(
                <Routes>
                    <Route path={route.matchPath} element={component} />
                </Routes>,
                { wrapper: Wrapper, ...renderOptions }
            ),
        };
    }

    return {
        store,
        ...render(component, { wrapper: Wrapper, ...renderOptions }),
    };
};
