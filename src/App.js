import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import LoginForm from './features/auth/LoginForm';
import Leaderboard from './features/employees/Leaderboard';
import AddPollForm from './features/polls/AddPollForm';
import PollsList from './features/polls/PollsList';
import { authenticatedUser } from './features/auth/authSlice';
import NotFound from './components/NotFound';

export default function App() {
    const authenticated = useSelector(authenticatedUser);

    return (
        <BrowserRouter>
            {authenticated ? (
                <>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<PollsList />} />
                        <Route path="add" element={<AddPollForm />} />
                        <Route path="leaderboard" element={<Leaderboard />} />
                    </Routes>
                </>
            ) : (
                <Routes>
                    <Route path="/" element={<LoginForm />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            )}
        </BrowserRouter>
    );
}
