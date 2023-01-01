import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { _getQuestions, _saveQuestion } from '../../api/_data';

const initialState = {
    ids: [],
    entities: {},
    status: 'idle',
    error: null,
};

const sortIds = polls =>
    Object.values(polls)
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(poll => poll.id);

export const fetchPolls = createAsyncThunk('polls/fetchPolls', async () => {
    const response = await _getQuestions();
    return response;
});

export const addNewPoll = createAsyncThunk(
    'polls/addNewPoll',
    async question => {
        const response = await _saveQuestion(question);
        return response;
    }
);

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
                state.ids = sortIds(action.payload);
                state.entities = action.payload;
            })
            .addCase(fetchPolls.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });

        builder.addCase(addNewPoll.fulfilled, (state, action) => {
            const savedQuestion = action.payload;
            state.entities[savedQuestion.id] = savedQuestion;
            state.ids = sortIds(state.entities);
        });
    },
});

export default pollsSlice.reducer;

export const fetchPollsStatus = state => state.polls.status;

export const selectAllPolls = state => Object.values(state.polls.entities);

export const selectPollIds = state => state.polls.ids;

export const selectPollById = (state, id) => state.polls.entities[id];
