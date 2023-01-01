import Content from '../../components/Content';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewPoll } from './pollsSlice';
import { authenticatedUser } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { pollAdded } from '../employees/employeesSlice';
import FlashError from '../../components/FlashError';
import Button from '../../components/Button';

export default function AddPollForm() {
    const [firstOption, setFirstOption] = useState('');
    const [secondOption, setSecondOption] = useState('');
    const [submitRequestStatus, setSubmitRequestStatus] = useState('idle');
    const [error, setError] = useState(null);

    const firstOptionEl = useRef(null);
    useEffect(() => firstOptionEl.current.focus(), []);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const author = useSelector(authenticatedUser);

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
                        author,
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
        <Content heading="Add New Poll">
            <div className="bg-white rounded p-2 lg:p-6 drop-shadow-md">
                <img
                    className={
                        'mx-auto h-12 w-auto rounded mb-8' +
                        (submitRequestStatus === 'pending'
                            ? ' animate-bounce'
                            : '')
                    }
                    src="/logo512.png"
                    alt="Employee Polls"
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
