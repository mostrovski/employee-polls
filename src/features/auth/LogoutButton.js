import { useDispatch } from 'react-redux';
import { ArrowRightOnRectangleIcon } from '@heroicons/react/20/solid';
import { logout } from './authSlice';

export default function LogoutButton() {
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <button
            onClick={handleLogout}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <ArrowRightOnRectangleIcon
                    className="h-5 w-5 text-violet-500 group-hover:text-violet-400"
                    aria-hidden="true"
                />
            </span>
            Sign out
        </button>
    );
}
