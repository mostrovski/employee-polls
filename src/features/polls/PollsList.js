import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import format from 'date-fns/format';
import { fetchPollsStatus, selectPollIds, selectPollById } from './pollsSlice';
import Content from '../../components/Content';
import {
    selectAuthenticatedEmployee,
    selectEmployeeById,
} from '../employees/employeesSlice';
import { Link } from 'react-router-dom';
import PendingContent from '../../components/PendingContent';

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
            <Link
                to={`/questions/${poll.id}`}
                className="link-primary block mt-3"
            >
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
    const heading = 'Employee Polls';

    const [showResponded, setShowResponded] = useState(false);

    const pollIds = useSelector(selectPollIds);
    const pollsStatus = useSelector(fetchPollsStatus);
    const authenticatedEmployee = useSelector(selectAuthenticatedEmployee);

    const employeeAnswers = Object.keys(authenticatedEmployee?.answers ?? {});

    const responded = useMemo(
        () => pollIds.filter(id => employeeAnswers.includes(id)),
        [pollIds, employeeAnswers]
    );

    const notResponded = useMemo(
        () => pollIds.filter(id => !employeeAnswers.includes(id)),
        [pollIds, employeeAnswers]
    );

    if (pollsStatus === 'succeeded' && authenticatedEmployee) {
        return (
            <Content heading={heading}>
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
            </Content>
        );
    }

    return <PendingContent heading={heading} />;
}
