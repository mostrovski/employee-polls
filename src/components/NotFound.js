import { Link } from 'react-router-dom';
import Content from './Content';

export default function NotFound() {
    return (
        <Content heading="404">
            <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <img
                            className="mx-auto h-14 w-auto rounded"
                            src="/logo512.png"
                            alt="Employee Polls"
                        />
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            Failed to find anything...
                        </h2>
                    </div>

                    <div className="text-center">
                        <Link to="/" className="link-primary">
                            Start over
                        </Link>
                    </div>
                </div>
            </div>
        </Content>
    );
}
