import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import format from 'date-fns/format';
import {
    fetchPolls,
    fetchPollsStatus,
    selectAllPolls,
    selectPollById,
} from './pollsSlice';
import Content from '../../components/Content';

const PollsListItem = ({ pollId }) => {
    const poll = useSelector(state => selectPollById(state, pollId));

    return (
        <div>
            <h1>{poll.author}</h1>
            <p>
                {format(new Date(poll.timestamp), "dd/MM/yyyy 'at' HH:mm:ss")}
            </p>
        </div>
    );
};

export default function PollsList() {
    const dispatch = useDispatch();
    const polls = useSelector(selectAllPolls);
    const pollsStatus = useSelector(fetchPollsStatus);

    useEffect(() => {
        if (pollsStatus === 'idle') {
            dispatch(fetchPolls());
        }
    }, [pollsStatus, dispatch]);

    let content = 'Polls are loading...';

    if (pollsStatus === 'succeeded') {
        content = Object.keys(polls).map(id => (
            <PollsListItem key={id} pollId={id} />
        ));
    }

    return <Content heading="Employee Polls">{content}</Content>;
}
