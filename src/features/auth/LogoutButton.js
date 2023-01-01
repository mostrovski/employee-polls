import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from './authSlice';
import Button from '../../components/Button';

export default function LogoutButton() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return <Button text="Sign out" icon="logout" onClick={handleLogout} />;
}
