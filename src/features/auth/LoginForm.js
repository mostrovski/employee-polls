import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LockClosedIcon } from '@heroicons/react/20/solid';
import { login } from './authSlice';
import FlashError from '../../components/FlashError';

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [attemptStatus, setAttemptStatus] = useState('idle');
    const [error, setError] = useState(null);

    const usernameInputEl = useRef(null);
    useEffect(() => usernameInputEl.current.focus(), []);

    const dispatch = useDispatch();

    const handleUsernameChange = event =>
        setUsername(event.target.value.trim());
    const handlePasswordChange = event =>
        setPassword(event.target.value.trim());

    const canAttemptLogin =
        [username, password].every(Boolean) && attemptStatus === 'idle';

    const handleLogin = async event => {
        event.preventDefault();
        setError(null);

        if (canAttemptLogin) {
            try {
                setAttemptStatus('pending');
                await dispatch(login({ username, password })).unwrap();
            } catch (error) {
                setError(error.message);
            } finally {
                setAttemptStatus('idle');
            }
        }
    };

    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <img
                        className={
                            'mx-auto h-12 w-auto rounded' +
                            (attemptStatus === 'pending'
                                ? ' animate-bounce'
                                : '')
                        }
                        src="/logo512.png"
                        alt="Employee Polls"
                    />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Sign in to your account
                    </h2>
                    <FlashError message={error} />
                </div>
                <form
                    className="mt-8 space-y-6"
                    method="POST"
                    onSubmit={event => handleLogin(event)}
                >
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
                                placeholder="Username"
                                onChange={event => handleUsernameChange(event)}
                                ref={usernameInputEl}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-violet-500 focus:outline-none focus:ring-violet-500 sm:text-sm"
                                placeholder="Password"
                                onChange={event => handlePasswordChange(event)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm font-medium text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                        >
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <LockClosedIcon
                                    className="h-5 w-5 text-violet-500 group-hover:text-violet-400"
                                    aria-hidden="true"
                                />
                            </span>
                            <span>Sign in</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
