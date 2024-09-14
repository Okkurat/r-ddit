import React, { FormEvent, useState } from 'react';

interface ModDialogProps {
  onClose: () => void;
  onSubmit: (reason: string, details: string, duration: number) => void;
}

const ModDialog = ({ onClose, onSubmit }: ModDialogProps) => {
  const [banReason, setBanReason] = useState('');
  const [banDetails, setBanDetails] = useState('');
  const [banDuration, setBanDuration] = useState(1);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(banReason, banDetails, banDuration);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-[#171717] p-6 rounded border border-[#242424] max-w-sm w-full"
      >
        <h2 className="text-lg font-bold mb-4">Ban user</h2>
        <p className="mb-6">Please provide details for the ban:</p>
        <div className="mb-4">
          <label htmlFor="report-reason" className="block text-sm font-medium text-[#CCCCCC] mb-2">Reason</label>
          <select
            onChange={(e) => setBanReason(e.target.value)}
            name="reason"
            value={banReason}
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
          <label htmlFor="ban-duration" className="block text-sm font-medium text-[#CCCCCC] mb-2">Ban duration (days)</label>
          <input
            type="number"
            id="ban-duration"
            name="duration"
            value={banDuration}
            onChange={(e) => setBanDuration(parseInt(e.target.value))}
            min="1"
            className="w-full bg-[#242424] text-[#CCCCCC] border border-[#3E3F3E] rounded px-3 py-2"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="report-details" className="block text-sm font-medium text-[#CCCCCC] mb-2">Details</label>
          <textarea
            name="details"
            value={banDetails}
            onChange={(e) => setBanDetails(e.target.value)}
            rows={4}
            className="w-full bg-[#242424] text-[#CCCCCC] border border-[#3E3F3E] rounded px-3 py-2"
            required
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onClose}
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
  );
};

export default ModDialog;