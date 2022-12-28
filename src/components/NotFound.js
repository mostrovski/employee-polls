import { NavLink } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    <img
                        className="mx-auto h-12 w-auto rounded"
                        src="/logo512.png"
                        alt="Your Company"
                    />
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                        Failed to find anything...
                    </h2>
                </div>

                <div className="text-center">
                    <NavLink
                        to="/"
                        className="font-medium text-violet-600 hover:text-violet-500"
                    >
                        Sign in to your account
                    </NavLink>
                </div>
            </div>
        </div>
    );
}
