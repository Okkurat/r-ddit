import { checkRole } from "@/app/server-actions";
import Ban from "@/models/ban";
import { Ban as BanType } from "@/types/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BanCard from "./BanCard";
import Message from "@/models/message";

const BansPage = async () => {

  const user = await currentUser();
  let bans = null;
  let data = null;

  if (!user) {
    return <div>Error</div>;
  }
  if (!checkRole('admin')) {
    redirect('/');
  }
  try {
    bans = await Ban.find({})
    .populate('message', '', Message)
    .lean()
    .exec();
    if(!bans){ return <div>No bans available</div>; }
  } catch (error) {
    console.error('Error fetching bans:', error);
    return <div>Error</div>;
  } finally { 
    data = JSON.parse(JSON.stringify(bans));
  }
  console.log(data);
  data.map((ban: BanType) => {
    ban.bannedUntil = new Date(ban.bannedUntil).toLocaleString();
    return ban;
  });

  return (
    <div>
    <h1>Bans</h1>
    <div className="max-w-7xl mx-auto p-4 bg-[#121212] text-[#CCCCCC] rounded-lg border-2 border-[#242424]">
      {data.map((ban: BanType) => (
        <BanCard key={ban._id.toString()} ban={ban} />
      ))}
    </div>
    </div>
  );
};
export default BansPage;