'use client';

import { useFormState } from 'react-dom';
import { createTopic } from './actions';

const TopicForm = () => {
  // useActionState is new but it doesnt work in this codebase, switch to using after update :D
  const [state, formAction] = useFormState(createTopic, { message: ''});

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create a New Topic</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Topic Name:
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-smfocus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-500 hover:bg-blue-600`}
        >Post
        </button>
        <p>
        {state?.message}
        </p>
      </form>
    </div>
  );
};

export default TopicForm;
