import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import employeesReducer from '../features/employees/employeesSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        employees: employeesReducer,
    },
});
