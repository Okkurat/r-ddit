'use client';


import React, { useState } from 'react';
import { Ban } from "@/types/types";
import MessageMini from "./MessageMini";
import { unBanUser } from "@/app/actions";

interface BanCardProps {
  ban: Ban;
}

const BanCard = ({ ban }: BanCardProps) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleUnban = async () => {
    try {
      await unBanUser({ banId: ban._id.toString() });
      console.log('Unbanned user');
    } catch (error) {
      console.error('Error unbanning user:', error);
    }
  };

  return (
    <div className="bg-[#121212] p-4 rounded-lg mb-4 border border-[#242424] relative">
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-xl font-semibold">{ban.userId}</h2>
        <button
          onClick={handleUnban}
          className="bg-[#242424] text-[#CCCCCC] py-2 px-4 rounded hover:bg-[#3E3F3E]"
        >
          Done
        </button>
      </div>
      <p><strong>Reason:</strong> {ban.reason}</p>
      <p><strong>Author:</strong> {ban.details}</p>
      <p><strong>Timestamp:</strong> {ban.bannedUntil.toString()}</p>
      {showMessage && <MessageMini message={ban.message} />}
      <button
        className="mt-2 text-blue-500"
        onClick={() => setShowMessage((prev) => !prev)}
      >
        {showMessage ? "Hide Message" : "Show Message"}
      </button>
    </div>
  );
};

export default BanCard;