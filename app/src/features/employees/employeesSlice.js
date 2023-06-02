import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _getUsers } from '../../api/client';

const initialState = {
    entities: {},
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null, // null | String
};

// Thunks
export const fetchEmployees = createAsyncThunk(
    'employees/fetchEmployees',
    async () => {
        const response = await _getUsers();
        return response;
    }
);

// Slice - allows for 'mutating' logic in reducers. Because of the immer library
// working behind the scenes, the state remains immutable.
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

// Employees reducer
export default employeesSlice.reducer;

// Action creators
export const { pollAdded, voteSubmitted } = employeesSlice.actions;

// Selectors
export const fetchEmployeesStatus = state => state.employees.status;

export const selectAllEmployees = state =>
    Object.values(state.employees.entities);

export const selectEmployeeById = (state, id) => state.employees.entities[id];

export const selectAuthenticatedEmployee = state =>
    selectEmployeeById(state, state.auth.user);
