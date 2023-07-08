import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { authenticatedUser } from './features/auth/authSlice';
import Navbar from './components/Navbar';
import NotFound from './components/NotFound';
import Shell from './components/Shell';
import AddPollForm from './features/polls/AddPollForm';
import Leaderboard from './features/employees/Leaderboard';
import LoginForm from './features/auth/LoginForm';
import PollsList from './features/polls/PollsList';
import SinglePoll from './features/polls/SinglePoll';

export default function App() {
    const authenticated = useSelector(authenticatedUser);

    return (
        <>
            {authenticated ? (
                <Shell>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<PollsList />} />
                        <Route path="polls/:poll_id" element={<SinglePoll />} />
                        <Route path="add" element={<AddPollForm />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                        <Route path="404" element={<NotFound />} />
                        <Route path="*" element={<Navigate to="404" />} />
                    </Routes>
                </Shell>
            ) : (
                <Routes>
                    <Route path="*" element={<LoginForm />} />
                </Routes>
            )}
        </>
    );
}
