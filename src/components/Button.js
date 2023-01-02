import {
    LockClosedIcon,
    ArrowRightOnRectangleIcon,
    QueueListIcon,
} from '@heroicons/react/20/solid';

export default function Button({
    text,
    icon = null,
    onClick = null,
    type = 'button',
}) {
    const icons = {
        login: LockClosedIcon,
        logout: ArrowRightOnRectangleIcon,
        addPoll: QueueListIcon,
    };

    const Icon = icons[icon];

    return (
        <button
            type={type}
            onClick={onClick}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-violet-600 py-2 px-4 text-sm text-white hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
        >
            {Icon && (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <Icon
                        className="h-5 w-5 text-violet-500 group-hover:text-violet-400"
                        aria-hidden="true"
                    />
                </span>
            )}
            <span>{text}</span>
        </button>
    );
}
