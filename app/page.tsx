import { currentUser } from '@clerk/nextjs/server';
import '../lib/mongoose';
import CreateTopic from './CreateTopic';

const HomePage = async () => {

  const user = await currentUser();
  const username = user?.username;
  console.log(user);

  return (
    <div>
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Next.js App</h1>
        </div>
        <div>
        <h2>Username: {username}</h2>
        <CreateTopic></CreateTopic>
      </div>
    </div>
  );
};

export default HomePage;