import { _authenticate, _saveQuestion, _saveQuestionAnswer } from '../_data';

describe('authentication', () => {
    it('accepts correct credentials', async () => {
        const credentials = {
            username: 'tylermcginnis',
            password: 'abc321',
        };

        const response = await _authenticate(credentials);

        expect(response).toStrictEqual({ user: 'tylermcginnis' });
    });

    it('rejects wrong credentials', async () => {
        const credentials = {
            username: 'tylermcginnis',
            password: 'test',
        };

        await expect(_authenticate(credentials)).rejects.toBe(
            'Username or password is not valid'
        );
    });
});

describe('poll creation', () => {
    it('returns expected question object', async () => {
        const firstRandomValue = Math.random();
        const secondRandomValue = Math.random();
        const idMock =
            firstRandomValue.toString(36).substring(2, 15) +
            secondRandomValue.toString(36).substring(2, 15);

        const randomSpy = jest
            .spyOn(Math, 'random')
            .mockImplementationOnce(() => firstRandomValue)
            .mockImplementationOnce(() => secondRandomValue);

        const timeStampMock = Date.now();

        const dateSpy = jest
            .spyOn(Date, 'now')
            .mockImplementation(() => timeStampMock);

        const question = {
            author: 'sarahedo',
            optionOneText: 'go to work',
            optionTwoText: 'go home',
        };

        const response = await _saveQuestion(question);

        expect(response.id).toBe(idMock);
        expect(response.timestamp).toBe(timeStampMock);
        expect(response.author).toBe(question.author);
        expect(response.optionOne).toStrictEqual({
            votes: [],
            text: question.optionOneText,
        });
        expect(response.optionTwo).toStrictEqual({
            votes: [],
            text: question.optionTwoText,
        });

        randomSpy.mockRestore();
        dateSpy.mockRestore();
    });

    it('rejects requests with malformed question data', async () => {
        const author = 'sarahedo';
        const optionOneText = 'go to work';
        const optionTwoText = 'go home';
        const errorMessage =
            'Please provide optionOneText, optionTwoText, and author';

        await expect(_saveQuestion({})).rejects.toBe(errorMessage);

        await expect(_saveQuestion({ author })).rejects.toBe(errorMessage);

        await expect(_saveQuestion({ optionOneText })).rejects.toBe(
            errorMessage
        );

        await expect(_saveQuestion({ optionTwoText })).rejects.toBe(
            errorMessage
        );

        await expect(_saveQuestion({ author, optionOneText })).rejects.toBe(
            errorMessage
        );

        await expect(_saveQuestion({ author, optionTwoText })).rejects.toBe(
            errorMessage
        );

        await expect(
            _saveQuestion({ optionOneText, optionTwoText })
        ).rejects.toBe(errorMessage);
    });
});

describe('voting', () => {
    it('resolves when correct data is submitted', async () => {
        const vote = {
            authedUser: 'sarahedo',
            qid: 'xj352vofupe1dqz9emx13r',
            answer: 'optionOne',
        };

        await expect(_saveQuestionAnswer(vote)).resolves.toBe(true);
    });

    it('rejects requests with malformed vote data', async () => {
        const errorMessage = 'Please provide authedUser, qid, and answer';

        let vote = {
            authedUser: '',
            qid: 'xj352vofupe1dqz9emx13r',
            answer: 'optionOne',
        };

        await expect(_saveQuestionAnswer(vote)).rejects.toBe(errorMessage);

        vote = {
            authedUser: 'sarahedo',
            qid: '',
            answer: 'optionOne',
        };

        await expect(_saveQuestionAnswer(vote)).rejects.toBe(errorMessage);

        vote = {
            authedUser: 'sarahedo',
            qid: 'xj352vofupe1dqz9emx13r',
            answer: '',
        };

        await expect(_saveQuestionAnswer(vote)).rejects.toBe(errorMessage);
    });
});
