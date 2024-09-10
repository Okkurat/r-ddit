import { createReport, deleteMessage } from "@/app/actions";
import React, { FormEvent, useEffect, useRef, useState } from "react";

interface BurgerMenuProps {
  isUser: boolean;
  messageId: string;
}

const BurgerMenu = ({isUser, messageId} : BurgerMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => { 
    if(showDeleteDialog){
      setIsOpen(false);
    }
  }, [showDeleteDialog]);

  useEffect(() => { 
    if(showReportDialog){
      setIsOpen(false);
    }
  }, [showReportDialog]);

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

  const handleReportClick = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(reportDetails, reportReason, messageId);
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
      if(!isUser){
        return;
      }
      const { error, success} = await deleteMessage(messageId);
      if(error){
        console.error(error);
        return;
      }
      console.log(success);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete message", error);
    }
  };

  const openDialogDelete = () => {
    setShowDeleteDialog(true);
  };

  const closeDialogDelete = () => {
    setShowDeleteDialog(false);
  };
  const closeDialogReport = () => {
    setShowReportDialog(false);
  };
  const openDialogReport = () => {
    setShowReportDialog(true);
  };

  return (
    <div className="relative">
      <div ref={menuRef}>
      <button className="rounded bg-[#242424] hover:bg-[#3E3F3E] px-4 py-2 text-primary-foreground ml-1" onClick={() => setIsOpen(!isOpen)}>
        <MenuIcon/>
      </button>
      {isOpen && !showDeleteDialog && (
        <div className="absolute right-0 mt-1 w-48 border border-[#242424] bg-[#1a1a1a] p-2 rounded z-10">
          <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded-md" onClick={openDialogReport}>
            Report
          </button>
          {!isUser &&
          <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded mt-2" onClick={handleHideClick}>
            Hide
          </button>}
          {isUser &&           
          <button className="w-full px-4 py-2 text-[#CCCCCC] bg-[#242424] hover:bg-[#3E3F3E] rounded mt-2" onClick={openDialogDelete}>
            Delete
          </button>}
        </div>
      )}
      </div>
      {!isOpen && showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-[#171717] p-6 rounded border border-[#242424] max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this message?</p>
            <div className="flex justify-end">
              <button
                onClick={closeDialogDelete}
                className="bg-[#242424] text-[#CCCCCC] hover:bg-[#3E3F3E] px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-[#242424] text-[#CCCCCC] hover:bg-[#3E3F3E] px-4 py-2 rounded"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
      {!isOpen && showReportDialog && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <form
          onSubmit={handleReportClick}
          className="bg-[#171717] p-6 rounded border border-[#242424] max-w-sm w-full"
        >
          <h2 className="text-lg font-bold mb-4">Report Message</h2>
          <p className="mb-6">Please provide details for the report:</p>
          <div className="mb-4">
            <label htmlFor="report-reason" className="block text-sm font-medium text-[#CCCCCC] mb-2">Reason</label>
            <select
              onChange={(e) => setReportReason(e.target.value)}
              name="reason"
              value={reportReason}
              className="w-full bg-[#242424] text-[#CCCCCC] border border-[#3E3F3E] rounded px-3 py-2"
              required
            >
              <option value="">Select a reason</option>
              <option value="spam">Spam</option>
              <option value="abuse">Abuse</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="report-details" className="block text-sm font-medium text-[#CCCCCC] mb-2">Details</label>
            <textarea
              name="details"
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value)}
              rows={4}
              className="w-full bg-[#242424] text-[#CCCCCC] border border-[#3E3F3E] rounded px-3 py-2"
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeDialogReport}
              className="bg-[#242424] text-[#CCCCCC] hover:bg-[#3E3F3E] px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#242424] text-[#CCCCCC] hover:bg-[#3E3F3E] px-4 py-2 rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      )}
    </div>
  );
};

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
  );
};

export default BurgerMenu;
