import { currentUser } from '@clerk/nextjs/server';
import '../lib/mongoose';
import CreateTopic from './CreateTopic';

const HomePage = async () => {
  const user = await currentUser();
  const username = user?.username;
  console.log(user);

  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-4xl font-bold">Next.js App</h1>
      <h2 className="text-xl mt-4">Username: {username}</h2>
      <CreateTopic />
    </div>
  );
};

export default HomePage;
