'use client';
import { useState } from 'react';

const CreateTopic = () => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/topics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });

      if (!response.ok) {
        throw new Error('Failed to create topic');
      }

      const data = await response.json();
      console.log('Topic created:', data);
      setLoading(false);
    } 
    catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create a New Topic</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Topic Name:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>Create Topic</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
};

export default CreateTopic;
