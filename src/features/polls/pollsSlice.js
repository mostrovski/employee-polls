import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _getQuestions } from '../../api/_data';

const initialState = {
    entities: {},
    status: 'idle',
    error: null,
};

export const fetchPolls = createAsyncThunk('polls/fetchPolls', async () => {
    const response = await _getQuestions();

    const sorted = {};

    Object.values(response)
        .sort((a, b) => b.timestamp - a.timestamp)
        .forEach(poll => {
            sorted[poll.id] = poll;
        });

    return sorted;
});

const pollsSlice = createSlice({
    name: 'polls',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchPolls.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchPolls.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.entities = action.payload;
            })
            .addCase(fetchPolls.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default pollsSlice.reducer;

export const fetchPollsStatus = state => state.polls.status;

export const selectAllPolls = state => state.polls.entities;

export const selectPollById = (state, id) => state.polls.entities[id];
