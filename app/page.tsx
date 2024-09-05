import { currentUser } from '@clerk/nextjs/server';
import '../lib/mongoose';
import connectDB from '../lib/mongoose';
import Topic from '@/models/topic';
import CreatePost from './CreatePost';
import { TopicType } from '@/types/types';
import TopicForm from './TopicForm';

const HomePage = async () => {
  const user = await currentUser();
  const username = user?.username;
  let topics: TopicType[] = [];
  try {
    await connectDB();
    const topicsFromDB = await Topic.find();
    topics = topicsFromDB.map(topic => ({
      name: topic.name,
    }));
    topics.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error: unknown) {
    if(error instanceof Error){
      throw Error(error.message || 'Failed to fetch topic' );
    }
    else {
      throw Error('A unknown error occured');
    }
  }
  return (
    <div className="flex flex-col items-center mt-12">
      <h1 className="text-4xl font-bold">Next.js App</h1>
      <h2 className="text-xl mt-4">Username: {username}</h2>
      <CreatePost topics={topics}></CreatePost>
    </div>
  );
};

export default HomePage;
