const host = 'http://localhost:8080';

const headers = {
    Accept: 'application/json',
};

const reject = reason => Promise.reject(reason);
const resolve = data => Promise.resolve(data);

export async function _getUsers() {
    const response = await fetch(`${host}/users`, { headers });

    if (response.ok) {
        const resource = await response.json();

        const users = resource.data.reduce((result, user) => {
            result[user.username] = {
                id: user.username,
                name: `${user.firstName} ${user.lastName}`,
                avatarURL: user.avatar,
                answers: user.votes.reduce((obj, vote) => {
                    obj[vote.poll.key] = vote.optionId;

                    return obj;
                }, {}),
                questions: user.polls.map(poll => poll.key),
            };

            return result;
        }, {});

        return resolve(users);
    }

    return reject('Something went wrong');
}

export async function _getQuestions() {
    const response = await fetch(`${host}/polls`, { headers });

    if (response.ok) {
        const resource = await response.json();

        const polls = resource.data.reduce((result, poll) => {
            result[poll.key] = {
                id: poll.key,
                author: poll.author.username,
                timestamp: new Date(poll.createdAt).getTime(),
                options: poll.options.reduce((result, option) => {
                    result[option.id] = {
                        id: option.id,
                        text: option.text,
                        votes: option.voters.map(voter => voter.username),
                    };

                    return result;
                }, {}),
            };

            return result;
        }, {});

        return resolve(polls);
    }

    return reject('Something went wrong');
}

export async function _saveQuestion(question) {
    const response = await fetch(`${host}/polls`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(question),
    });

    if (response.ok) {
        const resource = await response.json();

        const poll = {
            id: resource.data.key,
            author: question.username,
            timestamp: new Date(resource.data.createdAt).getTime(),
            options: resource.data.options.reduce((result, option) => {
                result[option.id] = {
                    id: option.id,
                    text: option.text,
                    votes: [],
                };

                return result;
            }, {}),
        };

        return resolve(poll);
    }

    switch (response.status) {
        case 400:
        case 404:
            return reject('Submitted data is not valid');
        default:
            return reject('Something went wrong');
    }
}

export async function _saveQuestionAnswer({ user, option }) {
    const response = await fetch(`${host}/options/${option}/vote`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: user }),
    });

    if (response.ok) {
        return resolve(true);
    }

    switch (response.status) {
        case 400:
        case 404:
            return reject('Submitted data is not valid');
        case 422:
            return reject('You have already responded to this poll');
        default:
            return reject('Something went wrong');
    }
}

export async function _authenticate(credentials) {
    const response = await fetch(`${host}/auth`, {
        method: 'POST',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (response.ok) {
        const data = await response.json();

        return resolve(data);
    }

    switch (response.status) {
        case 400:
        case 404:
            return reject('Username or password is not valid');
        default:
            return reject('Something went wrong');
    }
}
