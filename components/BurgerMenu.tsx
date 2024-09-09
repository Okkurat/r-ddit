import React, { useState } from "react"

interface BurgerMenuProps {
  isUser: boolean;
  messageId: string;
}

const BurgerMenu = ({isUser, messageId} : BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleReportClick = () => {
    console.log("Report button clicked", messageId)
  }
  const handleHideClick = () => {
    console.log("Hide button clicked", messageId)
  }
  const handleDeleteClick = () => {
    console.log("Delete button clicked", messageId)
  }
  return (
    <div className="relative">
      <button className="rounded bg-[#242424] hover:bg-[#3E3F3E] px-4 py-2 text-primary-foreground ml-1" onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon/>
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-1 w-48 border border-[#242424] bg-[#1a1a1a] p-2 rounded z-10">
          <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded-md mb-2" onClick={handleReportClick}>
            Report
          </button>
          <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded" onClick={handleHideClick}>
            Hide
          </button>
          {isUser &&           
          <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded mt-2" onClick={handleDeleteClick}>
            Delete
          </button>}
        </div>
      )}
    </div>
  )
}

const MenuIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

export default BurgerMenu;
