import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import employeesReducer from '../features/employees/employeesSlice';
import pollsReducer from '../features/polls/pollsSlice';

const reducer = {
    auth: authReducer,
    employees: employeesReducer,
    polls: pollsReducer,
};

export const setupStore = preloadedState => {
    return configureStore({ reducer, preloadedState });
};

export const store = setupStore();
