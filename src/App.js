import { Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Shell from './components/Shell';
import Navbar from './components/Navbar';
import LoginForm from './features/auth/LoginForm';
import Leaderboard from './features/employees/Leaderboard';
import AddPollForm from './features/polls/AddPollForm';
import PollsList from './features/polls/PollsList';
import { authenticatedUser } from './features/auth/authSlice';
import NotFound from './components/NotFound';
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
                        <Route path="polls/:pollId" element={<SinglePoll />} />
                        <Route path="add" element={<AddPollForm />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
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
