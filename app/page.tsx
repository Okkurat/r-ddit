import { currentUser } from '@clerk/nextjs/server';
import '../lib/mongoose';
import connectDB from '../lib/mongoose';
import Topic from '@/models/topic';
import CreatePost from './CreatePost';
import { TopicType } from '@/lib/types';
import TopicForm from './TopicForm';

const HomePage = async () => {
  const user = await currentUser();
  const username = user?.username;
  if(!user){
    return <div>Error</div>;
  }
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
    <div className="max-w-7xl mx-auto p-4 bg-[#121212] text-[#CCCCCC] rounded-lg border-2 border-[#242424]">
      <CreatePost topics={topics}></CreatePost>
    </div>
  );
};

export default HomePage;
