import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchEmployees,
    fetchEmployeesStatus,
} from '../features/employees/employeesSlice';
import { fetchPolls, fetchPollsStatus } from '../features/polls/pollsSlice';

export default function Shell({ children }) {
    const dispatch = useDispatch();
    const employeesStatus = useSelector(fetchEmployeesStatus);
    const pollsStatus = useSelector(fetchPollsStatus);

    useEffect(() => {
        if (employeesStatus === 'idle') {
            dispatch(fetchEmployees());
        }
    }, [employeesStatus, dispatch]);

    useEffect(() => {
        if (pollsStatus === 'idle') {
            dispatch(fetchPolls());
        }
    }, [pollsStatus, dispatch]);

    return <>{children}</>;
}
