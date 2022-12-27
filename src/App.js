import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Leaderboard from './features/employees/Leaderboard';
import AddPollForm from './features/polls/AddPollForm';
import PollsList from './features/polls/PollsList';

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<PollsList />} />
                <Route path="add" element={<AddPollForm />} />
                <Route path="leaderboard" element={<Leaderboard />} />
            </Routes>
        </BrowserRouter>
    );
}
