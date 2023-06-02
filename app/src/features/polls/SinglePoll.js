import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Content from '../../components/Content';
import FlashError from '../../components/FlashError';
import PendingContent from '../../components/PendingContent';
import { fetchPollsStatus, selectPollById, submitVote } from './pollsSlice';
import {
    fetchEmployeesStatus,
    selectAuthenticatedEmployee,
    selectEmployeeById,
    voteSubmitted,
} from '../employees/employeesSlice';

const VoteOption = ({ text, onClick }) => {
    return (
        <div className="max-w-xl mx-auto">
            <div
                data-testid="poll-option"
                className="bg-violet-600 cursor-pointer py-3 px-4 space-x-3 text-white text-md text-center rounded-md border"
                onClick={onClick}
            >
                <span data-testid="option-text">{text}</span>
            </div>
        </div>
    );
};

const OptionStats = ({ option, text, response, optionVotes, totalVotes }) => {
    const calculatePercentage = (part, total) => {
        if (part === 0 || total === 0) {
            return 0;
        }

        return ((part / total) * 100).toFixed();
    };

    return (
        <div className="max-w-xl mx-auto">
            <div
                data-testid="responded-poll-option"
                className={
                    'select-none flex flex-wrap w-full justify-center py-2 px-4 space-x-3 text-md rounded-md border' +
                    (response === option ? ' border-violet-600' : '')
                }
            >
                <span className="my-1" data-testid="option-text">
                    {text}
                </span>
                <span className="my-1 font-semibold" data-testid="option-stats">
                    {`${calculatePercentage(
                        optionVotes,
                        totalVotes
                    )}% (${optionVotes} voted)`}
                </span>
            </div>
        </div>
    );
};

export default function SinglePoll() {
    const { question_id: pollId } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const employeesStatus = useSelector(fetchEmployeesStatus);
    const pollsStatus = useSelector(fetchPollsStatus);
    const stateIsReady =
        employeesStatus === 'succeeded' && pollsStatus === 'succeeded';

    const poll = useSelector(state => selectPollById(state, pollId));
    const pollNotFound = !poll && stateIsReady;

    const author = useSelector(state =>
        selectEmployeeById(state, poll?.author)
    );
    const authenticatedEmployee = useSelector(selectAuthenticatedEmployee);

    const response = authenticatedEmployee?.answers[poll?.id];

    const [responded, setResponded] = useState(Boolean(response));
    const [voteRequestStatus, setVoteRequestStatus] = useState('idle');
    const [error, setError] = useState(null);

    useEffect(() => {
        setResponded(Boolean(response));
    }, [response]);

    useEffect(() => {
        if (pollNotFound) {
            navigate('/404');
        }
    }, [navigate, pollNotFound]);

    if (!stateIsReady || pollNotFound) {
        return <PendingContent heading="Poll" />;
    }

    const pollOptions = Object.values(poll.options);

    const totalVotes = pollOptions.reduce(
        (total, current) => (total += current.votes.length),
        0
    );

    const heading =
        author.id === authenticatedEmployee.id
            ? 'Your Poll'
            : `Poll by ${author.name}`;

    const handleVote = async option => {
        setError(null);

        const vote = {
            userId: authenticatedEmployee.id,
            pollId: poll.id,
            option,
        };

        if (voteRequestStatus === 'idle') {
            try {
                setVoteRequestStatus('pending');

                setResponded(true);

                await dispatch(submitVote(vote)).unwrap();

                dispatch(voteSubmitted(vote));

                setResponded(true);
            } catch (error) {
                setError(error.message);
                setResponded(false);
            } finally {
                setVoteRequestStatus('idle');
            }
        }
    };

    return (
        <Content heading={heading}>
            <div className="bg-white rounded py-6 drop-shadow-md">
                <div className="grid items-center lg:grid-cols-3 gap-3 my-6">
                    <div>
                        {author && (
                            <img
                                data-testid="author-avatar"
                                className="w-auto mx-auto rounded-full"
                                src={author.avatarURL}
                                alt={author.name}
                            />
                        )}
                    </div>

                    <div className="lg:col-span-2 text-center space-y-6 px-2">
                        <h2 className="text-3xl font-semibold">
                            Would you rather
                        </h2>
                        <FlashError message={error} />

                        {responded
                            ? pollOptions.map(option => (
                                  <OptionStats
                                      key={option.id}
                                      option={option.id}
                                      text={option.text}
                                      response={response}
                                      optionVotes={option.votes.length}
                                      totalVotes={totalVotes}
                                  />
                              ))
                            : pollOptions.map(option => (
                                  <VoteOption
                                      key={option.id}
                                      text={option.text}
                                      onClick={() => handleVote(option.id)}
                                  />
                              ))}
                    </div>
                </div>
            </div>
        </Content>
    );
}
