import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
import {
    fetchPolls,
    fetchPollsStatus,
    selectPollIds,
    selectPollById,
} from './pollsSlice';
import Content from '../../components/Content';
import {
    selectAuthenticatedEmployee,
    selectEmployeeById,
} from '../employees/employeesSlice';
import { Link } from 'react-router-dom';

const PollCard = ({ pollId }) => {
    const poll = useSelector(state => selectPollById(state, pollId));
    const author = useSelector(state => selectEmployeeById(state, poll.author));

    return (
        <div
            data-testid="poll-card"
            className="bg-white p-5 rounded drop-shadow-md text-center"
        >
            <div>
                by <span className="font-semibold">{author.name}</span>
            </div>
            <div>
                {format(
                    new Date(poll.timestamp),
                    "MMMM d, yyyy, 'at' HH:mm:ss"
                )}
            </div>
            <Link to={`/polls/${poll.id}`} className="link-primary block mt-3">
                Show
            </Link>
        </div>
    );
};

const PollsGrid = ({ pollIds }) => {
    return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3 my-6">
            {pollIds.map(id => (
                <PollCard key={id} pollId={id} />
            ))}
        </div>
    );
};

export default function PollsList() {
    const [showResponded, setShowResponded] = useState(false);

    const dispatch = useDispatch();

    const pollIds = useSelector(selectPollIds);
    const pollsStatus = useSelector(fetchPollsStatus);
    const authenticatedEmployee = useSelector(selectAuthenticatedEmployee);

    useEffect(() => {
        if (pollsStatus === 'idle') {
            dispatch(fetchPolls());
        }
    }, [pollsStatus, dispatch]);

    const employeeAnswers = Object.keys(authenticatedEmployee?.answers ?? {});

    const responded = useMemo(
        () => pollIds.filter(id => employeeAnswers.includes(id)),
        [pollIds, employeeAnswers]
    );

    const notResponded = useMemo(
        () => pollIds.filter(id => !employeeAnswers.includes(id)),
        [pollIds, employeeAnswers]
    );

    let content = (
        <div className="h-96 rounded-lg bg-white flex justify-center items-center animate-pulse">
            <div className="text-7xl">...</div>
        </div>
    );

    if (pollsStatus === 'succeeded' && authenticatedEmployee) {
        content = (
            <>
                <div className="flex space-x-3">
                    <span
                        className={
                            showResponded
                                ? 'cursor-pointer'
                                : 'underline underline-offset-2 decoration-violet-600 font-semibold'
                        }
                        onClick={() => setShowResponded(false)}
                    >
                        Not responded
                    </span>
                    <span
                        className={
                            showResponded
                                ? 'underline underline-offset-2 decoration-violet-600 font-semibold'
                                : 'cursor-pointer'
                        }
                        onClick={() => setShowResponded(true)}
                    >
                        Responded
                    </span>
                </div>

                {showResponded ? (
                    <PollsGrid pollIds={responded} />
                ) : (
                    <PollsGrid pollIds={notResponded} />
                )}
            </>
        );
    }

    return <Content heading="Employee Polls">{content}</Content>;
}
