import Ban from "@/models/ban";
import Message from "@/models/message";
import { currentUser } from "@clerk/nextjs/server";

const BannedPage = async () => {

  const user = await currentUser();
  if(!user){
    return <div>Error</div>;
  }
  const ban = await Ban.findOne({ userId: user.id }).populate('message', '', Message).lean().exec();
  if(!ban){
    return <div>Error</div>;
  }
  const data = JSON.parse(JSON.stringify(ban));
  data.bannedUntil = new Date(data.bannedUntil).toLocaleString();
  data.message.timestamp = new Date(data.message.timestamp).toLocaleString();

  return (
    <div className="max-w-7xl mx-auto p-4 bg-[#121212] text-[#CCCCCC] rounded-lg border-2 border-[#242424]">
      <div className="mb-2">
        <h1 className="text-2xl font-bold mb-4">You were banned for {ban.reason}</h1>
        <p className="mb-6">Details: {ban.details}</p>
        <div className="bg-[#171717]">
        <div id={data.message._id} className="p-2 rounded-lg ml-2">
        <div className="flex justify-between items-center mb-2 mr-2">
          <h2 className="text-lg font-semibold">{data.message.timestamp ? data.message.timestamp : 'No timestamp'}</h2>
        </div>
        <div>{data.message.content}</div>
        </div>
      </div>
      </div>
      <h1>Ban will expire at {data.bannedUntil}</h1>
      <h1>Complaining about the ban is not possible</h1>
    </div>
  );
};

export default BannedPage;