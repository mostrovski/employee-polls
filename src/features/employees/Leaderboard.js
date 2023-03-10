import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { authenticatedUser } from '../auth/authSlice';
import { selectAllEmployees } from './employeesSlice';
import Content from '../../components/Content';
import PendingContent from '../../components/PendingContent';

export default function Leaderboard() {
    const heading = 'Polling Leaders';

    const employees = useSelector(selectAllEmployees);
    const authenticatedEmployee = useSelector(authenticatedUser);

    const stateIsReady = employees.length && authenticatedEmployee;

    const leaders = useMemo(
        () =>
            employees
                .map(employee => {
                    return {
                        id: employee.id,
                        name: employee.name,
                        avatar: employee.avatarURL,
                        responses: Object.keys(employee.answers).length,
                        polls: employee.questions.length,
                    };
                })
                .sort(
                    (a, b) => b.responses + b.polls - (a.responses + a.polls)
                ),
        [employees]
    );

    if (stateIsReady) {
        return (
            <Content heading={heading}>
                <div className="bg-white rounded p-2 lg:p-6 drop-shadow-md">
                    <table className="table-auto border-collapse w-full">
                        <thead>
                            <tr className="text-left text-gray-500 bg-gray-100">
                                <th className="px-2 lg:px-8 py-4">Users</th>
                                <th className="px-2 lg:px-8 py-4">Responses</th>
                                <th className="px-2 lg:px-8 py-4">Polls</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaders.map(leader => (
                                <tr
                                    data-testid="leader-row"
                                    className={
                                        authenticatedEmployee === leader.id
                                            ? 'animate-pulse border-b'
                                            : 'border-b'
                                    }
                                    key={leader.name}
                                >
                                    <td className="px-2 lg:px-8 py-4">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                data-testid="leader-avatar"
                                                className="h-8 w-8 rounded-full shrink-0"
                                                src={leader.avatar}
                                                alt={leader.name}
                                            />
                                            <div data-testid="leader-name">
                                                {leader.name}
                                            </div>
                                        </div>
                                    </td>
                                    <td
                                        className="px-2 lg:px-8 py-4"
                                        data-testid="leader-responses"
                                    >
                                        {leader.responses}
                                    </td>
                                    <td
                                        className="px-2 lg:px-8 py-4"
                                        data-testid="leader-polls"
                                    >
                                        {leader.polls}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Content>
        );
    }

    return <PendingContent heading={heading} />;
}
