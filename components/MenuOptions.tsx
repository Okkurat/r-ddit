import { useIsMod } from '@/lib/UserContext';
import React from 'react';

interface MenuOptionsProps {
  isUser: boolean;
  onReport: () => void;
  onHide: () => void;
  onDelete: () => void;
  onBan: () => void;
}

const MenuOptions = ({ isUser, onReport, onHide, onDelete, onBan }: MenuOptionsProps) => {

  const isMod = useIsMod();

  return (
    <div className="absolute right-0 mt-1 w-48 border border-[#242424] bg-[#1a1a1a] p-2 rounded z-10">
      <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded-md" onClick={onReport}>
        Report
      </button>
      {!isUser && (
        <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded mt-2" onClick={onHide}>
          Hide
        </button>
      )}
      {isUser && (
        <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded mt-2" onClick={onDelete}>
          Delete
        </button>
      )}
      {isMod && (
        <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded mt-2" onClick={onBan}>
          Ban
        </button>
      )}
    </div>
  );
};

export default MenuOptions;