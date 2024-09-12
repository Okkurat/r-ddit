import { createReport, deleteMessage } from "@/app/actions";
import React, { useEffect, useRef, useState } from "react";
import MenuIcon from "./MenuIcon";
import DeleteDialog from "./DeleteDialog";
import ReportDialog from "./ReportDialog";
import MenuOptions from "./MenuOptions";

interface BurgerMenuProps {
  isUser: boolean;
  messageId: string;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ isUser, messageId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && event.target instanceof Node && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  const handleReportSubmit = async (reportReason: string, reportDetails: string) => {
    try {
      const { error, success } = await createReport(reportDetails, reportReason, messageId);
      if (error) {
        console.error(error);
        return;
      }
      console.log(success);
      setShowReportDialog(false);
    } catch (error) {
      console.error("Failed to create report", error);
    }
  };

  const handleHideClick = () => {
    console.log("Hide button clicked", messageId);
  };

  const handleDeleteClick = async () => {
    try {
      if (!isUser) {
        return;
      }
      const { error, success } = await deleteMessage(messageId);
      if (error) {
        console.error(error);
        return;
      }
      console.log(success);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  };

  return (
    <div className="relative">
      <div ref={menuRef}>
        <button className="rounded bg-[#242424] hover:bg-[#3E3F3E] px-4 py-2 text-primary-foreground ml-1" onClick={() => setIsOpen(!isOpen)}>
          <MenuIcon />
        </button>
        {isOpen && (
          <MenuOptions
            isUser={isUser}
            onReport={() => setShowReportDialog(true)}
            onHide={handleHideClick}
            onDelete={() => setShowDeleteDialog(true)}
          />
        )}
      </div>
      {showDeleteDialog && (
        <DeleteDialog
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={handleDeleteClick}
        />
      )}
      {showReportDialog && (
        <ReportDialog
          onClose={() => setShowReportDialog(false)}
          onSubmit={handleReportSubmit}
        />
      )}
    </div>
  );
};

export default BurgerMenu;