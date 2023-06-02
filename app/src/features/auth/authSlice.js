import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _authenticate } from '../../api/client';

const initialState = {
    user: null,
};

// Thunks
export const login = createAsyncThunk('auth/login', async credentials => {
    const response = await _authenticate(credentials);
    return response;
});

// Slice - allows for 'mutating' logic in reducers. Because of the immer library
// working behind the scenes, the state remains immutable.
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout(state, action) {
            state.user = null;
        },
    },
    extraReducers(builder) {
        builder.addCase(login.fulfilled, (state, action) => {
            return action.payload;
        });
    },
});

// Action creators
export const { logout } = authSlice.actions;

// Auth reducer
export default authSlice.reducer;

// Selectors
export const authenticatedUser = state => state.auth.user;
