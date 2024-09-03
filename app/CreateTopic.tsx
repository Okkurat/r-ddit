'use client';

import { useState, FormEvent } from 'react';
import { createTopic } from './actions';

const CreateTopic = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { savedTopic } = await createTopic(name);
      setSuccess(`Topic created: ${savedTopic?.name}`);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create a New Topic</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Topic Name:
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 text-white font-semibold rounded-md shadow-sm ${
            loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          {loading ? 'Creating...' : 'Create Topic'}
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </form>
    </div>
  );
};

export default CreateTopic;
