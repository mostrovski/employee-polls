import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _getUsers } from '../../api/_data';

const initialState = {
    entities: {},
    status: 'idle',
    error: null,
};

export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async () => {
        const response = await _getUsers();
        return response;
    }
);

const employeesSlice = createSlice({
    name: 'employees',
    initialState,
    reducers: {
        pollAdded(state, action) {
            const { id, author } = action.payload;
            state.entities[author].questions.push(id);
        },
        voteSubmitted(state, action) {
            const { userId, pollId, option } = action.payload;
            state.entities[userId].answers[pollId] = option;
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchEmployees.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchEmployees.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(fetchEmployees.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default employeesSlice.reducer;

export const { pollAdded, voteSubmitted } = employeesSlice.actions;

export const fetchEmployeesStatus = state => state.employees.status;

export const selectAllEmployees = state =>
    Object.values(state.employees.entities);

export const selectEmployeeById = (state, id) => state.employees.entities[id];

export const selectAuthenticatedEmployee = state =>
    selectEmployeeById(state, state.auth.user);
