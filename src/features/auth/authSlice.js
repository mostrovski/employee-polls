import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _authenticate } from '../../api/_data';

const initialState = {
    user: null,
};

export const login = createAsyncThunk('auth/login', async credentials => {
    const response = await _authenticate(credentials);
    return response;
});

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

export const { logout } = authSlice.actions;

export default authSlice.reducer;

export const authenticatedUser = state => state.auth.user;
