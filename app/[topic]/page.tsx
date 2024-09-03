import Topic from '@/models/topic';
const Page = async ({ params }: any) => {
  const topicExist = await Topic.findOne({ name: params.topic }).exec();
  console.log(topicExist);
  if(!topicExist) return <>Topic does not exist</>
  return (
    <div>
      This is the {params.topic} topic
    </div>
  )
};

export default Page;