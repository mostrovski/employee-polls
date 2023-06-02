import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addNewPoll } from './pollsSlice';
import {
    pollAdded,
    selectAuthenticatedEmployee,
} from '../employees/employeesSlice';
import Button from '../../components/Button';
import Content from '../../components/Content';
import FlashError from '../../components/FlashError';
import PendingContent from '../../components/PendingContent';

export default function AddPollForm() {
    const heading = 'Add New Poll';

    const [firstOption, setFirstOption] = useState('');
    const [secondOption, setSecondOption] = useState('');
    const [submitRequestStatus, setSubmitRequestStatus] = useState('idle');
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const author = useSelector(selectAuthenticatedEmployee);

    const firstOptionEl = useRef(null);
    useEffect(() => author && firstOptionEl.current.focus(), [author]);

    if (!author) {
        return <PendingContent heading={heading} />;
    }

    const handleFirstOptionChange = event =>
        setFirstOption(event.target.value.trim());
    const handleSecondOptionChange = event =>
        setSecondOption(event.target.value.trim());

    const canSubmit =
        [firstOption, secondOption].every(Boolean) &&
        submitRequestStatus === 'idle';

    const handleSubmit = async event => {
        event.preventDefault();
        setError(null);

        if (canSubmit) {
            if (firstOption === secondOption) {
                setError('Options should be distinct');
                return;
            }

            try {
                setSubmitRequestStatus('pending');

                const newPoll = await dispatch(
                    addNewPoll({
                        username: author.id,
                        optionOneText: firstOption,
                        optionTwoText: secondOption,
                    })
                ).unwrap();

                dispatch(pollAdded(newPoll));

                navigate('/');
            } catch (error) {
                setError(error.message);
            } finally {
                setSubmitRequestStatus('idle');
            }
        }
    };

    return (
        <Content heading={heading}>
            <div className="bg-white rounded px-2 py-6 sm:px-6 drop-shadow-md">
                <img
                    className={
                        'mx-auto h-14 w-auto rounded mb-8' +
                        (submitRequestStatus === 'pending'
                            ? ' animate-bounce'
                            : '')
                    }
                    src={author.avatarURL}
                    alt={author.name}
                />
                <h2 className="text-center text-xl font-semibold">
                    Would you rather...
                </h2>
                <FlashError message={error} />
                <form method="POST" onSubmit={event => handleSubmit(event)}>
                    <div className="overflow-hidden max-w-md mx-auto">
                        <div className="px-4 py-5 sm:px-6 space-y-5">
                            <div className="">
                                <label
                                    htmlFor="first-option"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    First option
                                </label>
                                <input
                                    type="text"
                                    name="first-option"
                                    id="first-option"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={firstOption}
                                    onChange={event =>
                                        handleFirstOptionChange(event)
                                    }
                                    ref={firstOptionEl}
                                />
                            </div>

                            <div className="">
                                <label
                                    htmlFor="second-option"
                                    className="block text-sm font-medium text-gray-700"
                                >
                                    Second option
                                </label>
                                <input
                                    type="text"
                                    name="second-option"
                                    id="second-option"
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    value={secondOption}
                                    onChange={event =>
                                        handleSecondOptionChange(event)
                                    }
                                />
                            </div>
                        </div>
                        <div className="px-4 py-3 sm:px-6">
                            <Button
                                text="Submit"
                                type="submit"
                                icon="addPoll"
                            />
                        </div>
                    </div>
                </form>
            </div>
        </Content>
    );
}
