// https://redux.js.org/usage/writing-tests#setting-up-a-reusable-test-render-function

import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { setupStore } from '../app/store';

const isDefault = route => route.matchPath === '/' && route.currentPath === '/';

export const renderWithProviders = (
    component,
    {
        preloadedState = {},
        route = { matchPath: '/', currentPath: '/' },
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

    if (isDefault(route)) {
        return {
            store,
            ...render(component, { wrapper: Wrapper, ...renderOptions }),
        };
    }

    return {
        store,
        ...render(
            <Routes>
                <Route path={route.matchPath} element={component} />
            </Routes>,
            { wrapper: Wrapper, ...renderOptions }
        ),
    };
};
