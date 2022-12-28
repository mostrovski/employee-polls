import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchEmployees,
    fetchEmployeesStatus,
} from '../features/employees/employeesSlice';

export default function Shell({ children }) {
    const dispatch = useDispatch();
    const employeesStatus = useSelector(fetchEmployeesStatus);

    useEffect(() => {
        if (employeesStatus === 'idle') {
            dispatch(fetchEmployees());
        }
    }, [employeesStatus, dispatch]);

    return <>{children}</>;
}
